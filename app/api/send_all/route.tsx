import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect} from '@/lib/dbConnect';
import Alumni from '@/models/Main';
import { sendEventInvitationEmail } from '@/utils/sendMail';
import { createEventInvitationTemplate } from '@/utils/template'; // ✅ This is correct if template.ts exists

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Send All API route called - processing request...');
    
    // Authenticate the request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await request.json();
    // UPDATED: Extract all fields including date and location
    const { title, description, timing, date, location, attachments } = requestData;
    
    console.log('📋 Event details received:', { 
      title, 
      description, 
      timing, 
      date, 
      location, 
      attachmentCount: attachments?.length || 0 
    });
    
    // UPDATED: Validate all required fields
    if (!title || !description || !timing || !date || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required event fields (title, description, timing, date, location)' },
        { status: 400 }
      );
    }

    // Connect to database and fetch all alumni
    console.log('🔌 Connecting to database...');
    await dbConnect();
    
    console.log('📊 Fetching all alumni from database...');
    const alumni = await Alumni.find({}, {
      name: 1,
      email: 1,
      uid: 1,
      course: 1,
      department: 1,
      yearOfPassingOut: 1,
      _id: 1
    }).lean();

    console.log(`📋 Found ${alumni.length} total alumni in database`);

    // Filter alumni with valid emails
    const alumniWithEmails = alumni.filter(alum => 
      alum.email && 
      alum.email.trim() !== '' && 
      alum.email.includes('@')
    );

    console.log(`✅ ${alumniWithEmails.length} alumni have valid email addresses`);

    if (alumniWithEmails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No alumni with valid email addresses found' },
        { status: 400 }
      );
    }

    // Process attachments
    let attachmentsData: any[] = [];
    if (attachments && attachments.length > 0) {
      console.log(`📎 Processing ${attachments.length} attachments...`);
      
      try {
        attachmentsData = attachments.map((attachment: any) => ({
          filename: attachment.filename,
          content: Buffer.from(attachment.content),
          contentType: attachment.contentType
        }));
        console.log('✅ All attachments processed successfully');
      } catch (attachmentError) {
        console.error('❌ Error processing attachments:', attachmentError);
        return NextResponse.json(
          { success: false, error: 'Failed to process attachments' },
          { status: 400 }
        );
      }
    }

    // Send emails with batch processing
    let successCount = 0;
    let failedEmails: string[] = [];
    const BATCH_SIZE = 10;
    const DELAY_BETWEEN_BATCHES = 25;

    console.log(`📧 Starting to send emails to ${alumniWithEmails.length} alumni in batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < alumniWithEmails.length; i += BATCH_SIZE) {
      const batch = alumniWithEmails.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(alumniWithEmails.length / BATCH_SIZE);
      
      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} with ${batch.length} emails...`);
      
      // Send all emails in this batch simultaneously
      const batchPromises = batch.map(async (alumni) => {
        try {
          // CLEAN: Use email template utility instead of inline HTML
          const emailTemplate = createEventInvitationTemplate(
            title,
            description,
            timing,
            date,
            location,
            alumni.name
          );

          console.log(`📤 Sending email to ${alumni.email} (${alumni.name})...`);

          const result = await sendEventInvitationEmail(
            alumni.email,
            emailTemplate.subject,
            emailTemplate.html,
            emailTemplate.text,
            attachmentsData
          );

          if (result.success) {
            return { success: true, email: alumni.email, name: alumni.name };
          } else {
            return { success: false, email: alumni.email, name: alumni.name, error: result.error || 'Unknown error' };
          }
        } catch (error: any) {
          return { success: false, email: alumni.email, name: alumni.name, error: error.message };
        }
      });

      // Wait for all emails in this batch to complete
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Count results for this batch
      let batchSuccessCount = 0;
      let batchFailedCount = 0;
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            successCount++;
            batchSuccessCount++;
            console.log(`✅ Email sent successfully to ${result.value.email} (${result.value.name})`);
          } else {
            failedEmails.push(`${result.value.email}: ${result.value.error}`);
            batchFailedCount++;
            console.error(`❌ Failed to send to ${result.value.email}:`, result.value.error);
          }
        } else {
          failedEmails.push(`Unknown email: ${result.reason}`);
          batchFailedCount++;
          console.error(`❌ Batch promise rejected:`, result.reason);
        }
      });

      console.log(`📊 Batch ${batchNumber} completed. Success: ${batchSuccessCount}, Failed: ${batchFailedCount} | Total so far: ${successCount}/${successCount + failedEmails.length}`);

      // Small delay between batches
      if (i + BATCH_SIZE < alumniWithEmails.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log(`📊 Email sending complete. Success: ${successCount}, Failed: ${failedEmails.length}`);

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${successCount}/${alumniWithEmails.length} alumni`,
      successCount,
      failedCount: failedEmails.length,
      failedEmails: failedEmails.slice(0, 10),
      totalAlumni: alumniWithEmails.length
    });

  } catch (error: any) {
    console.error('❌ Send All API route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send bulk emails' },
      { status: 500 }
    );
  }
}