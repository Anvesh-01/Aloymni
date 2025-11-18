import React, { useState } from 'react'
import { Search, Users, Calendar, Briefcase, MapPin, TrendingUp, Menu, Filter, RotateCcw, Building, GraduationCap, Loader2, Verified, X, CloudFog } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AlumniTableProps {
    data: Alumni[]
    loading: boolean
    onDataUpdate: (updatedData: Alumni[]) => void
}

// Type definitions - Alumni interface with verified field for display
interface Alumni {
    uid: string
    registerNo?: string
    name: string
    yearOfPassingOut: number
    course: string
    department: string
    address: string
    email: string
    contactNo: string
    occupation?: string
    placeOfWork?: string
    designation?: string
    officialAddress?: string
    areaOfExpertise?: string
    contactsOfBatchmates?: string
    willingToContact?: boolean
    verified?: boolean // New field to indicate verification status
}


// Alumni Table Component
const VerificationTable: React.FC<AlumniTableProps> = ({ data, loading, onDataUpdate }) => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    // Function to handle verification toggle - uses User schema endpoint
    const handleVerificationToggle = async (uid: string, currentVerified: boolean) => {
        try {
            console.log('Toggling verification for UID:', uid, 'Current status:', currentVerified);

            // Set loading state for this specific user
            setLoadingStates(prev => ({ ...prev, [uid]: true }));

            // Call the User schema endpoint
            const response = await fetch(`/api/user/${uid}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    verified: !currentVerified
                }),
            });

            const responseData = await response.json();
            console.log('Response from verification API:', responseData);

            if (response.ok && responseData.success) {
                // Update the local state to reflect the change
                const { data: updatedUserData, message } = responseData;

                console.log('Success message:', message);
                console.log('Updated user UID:', updatedUserData.uid);
                console.log('New verification status:', updatedUserData.verified);

                // Use the actual returned verification status instead of assuming
                const updatedData = data.map(alumni =>
                    alumni.uid === updatedUserData.uid
                        ? { ...alumni, verified: updatedUserData.verified }
                        : alumni
                );
                onDataUpdate(updatedData);

                console.log('Verification status updated successfully');
            } else {
                console.error('Failed to update verification status:', responseData.error || responseData.message);
                // Handle error - you can add toast notification here
            }
        } catch (error) {
            console.error('Error updating verification status:', error);
            // Handle network error - you can add toast notification here
        } finally {
            // Clear loading state for this user
            setLoadingStates(prev => ({ ...prev, [uid]: false }));
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Alumni Verification Directory</CardTitle>
                    <CardDescription>Loading alumni data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2">Loading alumni data...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alumni Verification Directory</CardTitle>
                <CardDescription>Complete list of registered alumni ({data.length} records)</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <div className="overflow-x-auto overflow-y-scroll max-h-[350px]">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-3 font-medium">Name</th>
                                    <th className="text-left p-3 font-medium">Email</th>
                                    <th className="text-left p-3 font-medium">Register No.</th>
                                    <th className="text-left p-3 font-medium">Department</th>
                                    <th className="text-left p-3 font-medium">Course</th>
                                    <th className="text-left p-3 font-medium">Year</th>
                                    <th className="text-left p-3 font-medium">Verification Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((alumni) => {
                                    const isLoadingThisRow = loadingStates[alumni.uid] || false;

                                    return (
                                        <tr key={alumni.uid} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="p-3 font-medium">{alumni.name}</td>
                                            <td className="p-3 text-sm text-gray-600">{alumni.email}</td>
                                            <td className="p-3 text-sm">{alumni.registerNo || 'N/A'}</td>
                                            <td className="p-3 text-sm">{alumni.department}</td>
                                            <td className="p-3 text-sm">{alumni.course}</td>
                                            <td className="p-3 text-sm">{alumni.yearOfPassingOut}</td>
                                            <td className="p-3">
                                                {alumni.verified ? (
                                                    <button
                                                        className="flex items-center gap-2 text-green-700 bg-green-50 border-green-300 border rounded-lg px-3 py-2 hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                                        onClick={() => handleVerificationToggle(alumni.uid, alumni.verified || false)}
                                                        disabled={isLoadingThisRow}
                                                    >
                                                        <Verified size={14} />
                                                        {isLoadingThisRow ? 'Updating...' : 'Verified'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="flex items-center gap-2 text-red-700 bg-red-50 border-red-300 border rounded-lg px-3 py-2 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                                        onClick={() => handleVerificationToggle(alumni.uid, alumni.verified || false)}
                                                        disabled={isLoadingThisRow}
                                                    >
                                                        <X size={14} />
                                                        {isLoadingThisRow ? 'Updating...' : 'Not Verified'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No alumni data found. Upload CSV or check your filters.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default VerificationTable