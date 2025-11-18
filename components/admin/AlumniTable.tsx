import React from 'react'
import { Search, Users, Calendar, Briefcase, MapPin, TrendingUp, Menu, Filter, RotateCcw, Building, GraduationCap, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AlumniTableProps {
  data: Alumni[]
  loading: boolean
}

// Type definitions
interface Alumni {
  uid: string
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
}

// Alumni Table Component
const AlumniTable: React.FC<AlumniTableProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alumni Directory</CardTitle>
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
        <CardTitle>Alumni Directory</CardTitle>
        <CardDescription>Complete list of registered alumni ({data.length} records)</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-left p-2 font-medium">Email</th>
                  <th className="text-left p-2 font-medium">Department</th>
                  <th className="text-left p-2 font-medium">Course</th>
                  <th className="text-left p-2 font-medium">Year</th>
                  <th className="text-left p-2 font-medium">Occupation</th>
                  <th className="text-left p-2 font-medium">Company</th>
                  <th className="text-left p-2 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody>
                {data.map((alumni) => (
                  <tr key={alumni.uid} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{alumni.name}</td>
                    <td className="p-2 text-sm text-gray-600">{alumni.email}</td>
                    <td className="p-2">{alumni.department}</td>
                    <td className="p-2 text-sm">{alumni.course}</td>
                    <td className="p-2">{alumni.yearOfPassingOut}</td>
                    <td className="p-2">{alumni.occupation || "-"}</td>
                    <td className="p-2">{alumni.placeOfWork || "-"}</td>
                    <td className="p-2">
                      {alumni.willingToContact ? (
                        <Badge variant="outline" className="text-green-700 border-green-300">Available</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-700 border-red-300">Private</Badge>
                      )}
                    </td>
                  </tr>
                ))}
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

export default AlumniTable