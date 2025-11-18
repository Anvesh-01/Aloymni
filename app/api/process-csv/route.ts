import { NextRequest, NextResponse } from 'next/server';
import csv from 'csvtojson';
import { generatePassword, generateUsername } from '@/lib/generate';
import { runImport } from '@/utils/clerk-ids';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvData = await file.text();
    const jsonArray = await csv().fromString(csvData);

    // Map CSV data to the desired structure
    const mappedData = jsonArray.map((row) => {
      const uid = generateUsername(row);
      return {
        uid,
        alumniData: {
          uid,
          name: row["Name"],
          yearOfPassingOut: Number(row["Year of passing out"]),
          course: row["Course"],
          department: row["Department"],
          address: row["Address"],
          email: row["E-mail"],
          contactNo: row["Contact No."],
          occupation: row["Occupation"],
          placeOfWork: row["Place of work"],
          designation: row["Position( Designation)"],
          officialAddress: row["Official address"],
          higherEducation: {
            course: row["Higher education if any: A) Course"],
            institution: row["Higher education if any: B) Institution"],
            year: Number(row["Higher education if any: C) Year of passing"]),
          },
          highestDegree: {
            specify: row["Highest degree A) Specify"],
            year: Number(row["Highest degree B) year"]),
          },
          areaOfExpertise: row["Area of expertise"],
          contactsOfBatchmates: row["Any contact of your classmates/ batchmates/friends"],
          willingToContact: row["Are you willing us to contact you for any area of your expertise"]?.toLowerCase() === "yes",
        },
      };
    });

    // Send to upload API
    const uploadResponse = await fetch(`${process.env.NEXTAUTH_URL || process.env.MAIN_URL}/api/upload-from-file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: mappedData }),
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }

    const result = await uploadResponse.json();
    console.log("Sending emails...");
      await runImport();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('CSV processing error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process CSV' }, { status: 500 });
  }
}