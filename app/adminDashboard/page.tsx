
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Calendar, Briefcase, MapPin, TrendingUp, Menu, Filter, RotateCcw, Building, GraduationCap, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import Link from "next/link"
import Upload from "@/components/upload"
import { extractCSV } from "@/lib/utils"
import AlumniTable from "@/components/admin/AlumniTable"
import VerificationTable from "@/components/admin/VerificationTable"
import { toast, Toaster } from "sonner"


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
  verified?: boolean
}

interface StatsData {
  totalAlumni: number
  courseStats: { course: string; count: number }[]
  yearStats: { year: number; count: number }[]
  departmentStats: { department: string; count: number }[]
  employmentRate: number
}

interface AlumniFiltersProps {
  alumniData: Alumni[]
  selectedCourses: string[]
  selectedYears: number[]
  selectedDepartments: string[]
  onCoursesChange: (courses: string[]) => void
  onYearsChange: (years: number[]) => void
  onDepartmentsChange: (departments: string[]) => void
  onReset: () => void
}

interface AlumniChartsProps {
  courseStats: { course: string; count: number }[]
  yearStats: { year: number; count: number }[]
  departmentStats: { department: string; count: number }[]
}

interface AlumniTableProps {
  data: Alumni[]
  loading: boolean
}

// Utility functions
const getAlumniByFilters = (
  data: Alumni[],
  selectedCourses: string[],
  selectedYears: number[],
  selectedDepartments: string[]
): Alumni[] => {
  return data.filter(alumni => {
    const courseMatch = selectedCourses.length === 0 || selectedCourses.includes(alumni.course)
    const yearMatch = selectedYears.length === 0 || selectedYears.includes(alumni.yearOfPassingOut)
    const deptMatch = selectedDepartments.length === 0 || selectedDepartments.includes(alumni.department)
    return courseMatch && yearMatch && deptMatch
  })
}

const getAlumniStats = (data: Alumni[]): StatsData => {
  const courseStats: Record<string, number> = {}
  const yearStats: Record<string, number> = {}
  const departmentStats: Record<string, number> = {}
  const employmentStats = { employed: 0, unemployed: 0 }

  data.forEach(alumni => {
    courseStats[alumni.course] = (courseStats[alumni.course] || 0) + 1
    yearStats[alumni.yearOfPassingOut.toString()] = (yearStats[alumni.yearOfPassingOut.toString()] || 0) + 1
    departmentStats[alumni.department] = (departmentStats[alumni.department] || 0) + 1

    if (alumni.occupation && alumni.placeOfWork) {
      employmentStats.employed++
    } else {
      employmentStats.unemployed++
    }
  })

  return {
    totalAlumni: data.length,
    courseStats: Object.entries(courseStats).map(([course, count]) => ({ course, count })),
    yearStats: Object.entries(yearStats).map(([year, count]) => ({ year: parseInt(year), count })),
    departmentStats: Object.entries(departmentStats).map(([department, count]) => ({ department, count })),
    employmentRate: data.length > 0 ? Math.round((employmentStats.employed / data.length) * 100) : 0
  }
}

// Alumni Filters Component
const AlumniFilters: React.FC<AlumniFiltersProps> = ({
  alumniData,
  selectedCourses,
  selectedYears,
  selectedDepartments,
  onCoursesChange,
  onYearsChange,
  onDepartmentsChange,
  onReset
}) => {
  const courses = [...new Set(alumniData.map(alumni => alumni.course))]
  const years = [...new Set(alumniData.map(alumni => alumni.yearOfPassingOut))].sort()
  const departments = [...new Set(alumniData.map(alumni => alumni.department))]

  const handleCourseChange = (course: string) => {
    if (selectedCourses.includes(course)) {
      onCoursesChange(selectedCourses.filter(c => c !== course))
    } else {
      onCoursesChange([...selectedCourses, course])
    }
  }

  const handleYearChange = (year: number) => {
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter(y => y !== year))
    } else {
      onYearsChange([...selectedYears, year])
    }
  }

  const handleDepartmentChange = (department: string) => {
    if (selectedDepartments.includes(department)) {
      onDepartmentsChange(selectedDepartments.filter(d => d !== department))
    } else {
      onDepartmentsChange([...selectedDepartments, department])
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
          <Button onClick={onReset} variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Department</h4>
          <div className="space-y-2">
            {departments.map(department => (
              <label key={department} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(department)}
                  onChange={() => handleDepartmentChange(department)}
                  className="rounded"
                />
                <span className="text-sm">{department}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Course</h4>
          <div className="space-y-2">
            {courses.map(course => (
              <label key={course} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course)}
                  onChange={() => handleCourseChange(course)}
                  className="rounded"
                />
                <span className="text-sm">{course}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Passing Year</h4>
          <div className="space-y-2">
            {years.map(year => (
              <label key={year} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={() => handleYearChange(year)}
                  className="rounded"
                />
                <span className="text-sm">{year}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Alumni Charts Component
const AlumniCharts: React.FC<AlumniChartsProps> = ({ courseStats, yearStats, departmentStats }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Alumni by Department</CardTitle>
        </CardHeader>
        <CardContent>
          {departmentStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  style={{ fontSize: 11 }}
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, percent }: any) => `${department} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alumni by Year</CardTitle>
        </CardHeader>
        <CardContent>
          {yearStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yearStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {yearStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={yearStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



export default function Dashboard() {
  // State for data
  const [alumniData, setAlumniData] = useState<Alumni[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")

  // State for UI
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
   const [isOpen, setIsOpen] = useState(false)
  // UPDATED: Added date and location fields
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    timing: "", 
    date: "", 
    location: "" 
  })
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // UPDATED: Use /api/send_all for bulk email sending with new fields
  const sendEventInvitations = async () => {
    // UPDATED: Validation for all required fields
    if (!formData.title || !formData.description || !formData.timing || !formData.date || !formData.location) {
      toast.error("Please fill in all event details (title, description, timing, date, and location)")
      return
    }

    setIsLoading(true)

    try {
      console.log('📧 Starting bulk email send to database alumni...')
      
      // Process attachments
      const attachmentsData = await Promise.all(
        attachmentFiles.map(async (file) => ({
          filename: file.name,
          content: Array.from(new Uint8Array(await file.arrayBuffer())),
          contentType: file.type
        }))
      )

      // UPDATED: Send all fields to API
      const response = await fetch('/api/send_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          timing: formData.timing,
          date: formData.date,
          location: formData.location,
          attachments: attachmentsData
        })
      })

      const result = await response.json()
      console.log('📊 API Response:', result)

      if (response.ok && result.success) {
        toast.success(`🎉 ${result.message}!`)
        console.log(`✅ Bulk email successful:`, result)
        
        if (result.failedCount > 0) {
          toast.warning(`⚠️ ${result.failedCount} emails failed to send. Check console for details.`)
          console.log('Failed emails:', result.failedEmails)
        }
      } else {
        throw new Error(result.error || 'Failed to send bulk emails')
      }

      // UPDATED: Reset all form fields
      setFormData({ title: "", description: "", timing: "", date: "", location: "" })
      setAttachmentFiles([])
      setIsOpen(false)
    } catch (error: any) {
      console.error('❌ Error in bulk email send:', error)
      toast.error(`Failed to send invitations: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }
    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid: File[] = []
    const errors: string[] = []

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`❌ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) - Too large!`)
      } else {
        valid.push(file)
      }
    })

    errors.forEach((error, i) => {
      setTimeout(() => toast.error(error, { duration: 6000, style: { background: '#fef2f2', color: '#dc2626', border: '2px solid #fca5a5', fontWeight: 'bold' } }), i * 200)
    })

    if (valid.length > 0) {
      setAttachmentFiles(prev => [...prev, ...valid])
      toast.success(`✅ ${valid.length} file(s) added successfully`, { duration: 3000 })
    }

    if (valid.length === 0 && files.length > 0) {
      toast.warning("No files were added due to size restrictions", { duration: 4000 })
    }

    e.target.value = ''
  }

   const fetchVerificationStatuses = async (alumni: Alumni[]): Promise<Alumni[]> => {
    try {
      const alumniWithVerification = await Promise.all(
        alumni.map(async (alumni) => {
          try {
            const response = await fetch('/api/is-verified', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ uid: alumni.uid }),
            });

            if (response.ok) {
              const data = await response.json();
              return { ...alumni, verified: data.verified };
            } else {
              return { ...alumni, verified: false };
            }
          } catch (error) {
            console.error(`Error fetching verification for ${alumni.uid}:`, error);
            return { ...alumni, verified: false };
          }
        })
      );

      return alumniWithVerification;
    } catch (error) {
      console.error('Error fetching verification statuses:', error);
      return alumni.map(alumni => ({ ...alumni, verified: false }));
    }
  };

  // Fetch alumni data from API
  const fetchAlumniData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/fetchData')

      if (!response.ok) {
        throw new Error('Failed to fetch alumni data')
      }

      const result = await response.json()

      if (result.success) {
        setAlumniData(result.alumni)
      } else {
        throw new Error(result.error || 'Failed to fetch alumni data')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching alumni data:', err)
    } finally {
      setLoading(false)
    }
  }

   // Handle verification data updates
  const handleVerificationDataUpdate = (updatedData: Alumni[]) => {
    setAlumniData(updatedData);
  };

  // Load data on component mount
  useEffect(() => {
    fetchAlumniData()
  }, [])

  // Scroll to section when hash is present (e.g., #achievements)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        const id = hash.replace('#', '')
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  /* Achievements section: inline in dashboard (CRUD via /api/achievements) */
  const [achievements, setAchievements] = useState<any[]>([])
  const [achModalOpen, setAchModalOpen] = useState(false)
  const [achEditingId, setAchEditingId] = useState<string | null>(null)
  const [achForm, setAchForm] = useState<{ title: string; description: string; alumniName: string; designation: string; date: string; imageFile: File | null; imagePreview: string }>({
    title: '',
    description: '',
    alumniName: '',
    designation: '',
    date: new Date().toISOString().split('T')[0],
    imageFile: null,
    imagePreview: ''
  })

  const loadAchievements = async () => {
    try {
      const res = await fetch('/api/achievements')
      const json = await res.json()
      if (json.success) {
        const data = json.achievements.map((a: any) => ({ id: a._id || a.id, ...a }))
        setAchievements(data)
      }
    } catch (e) {
      console.error('Failed to load achievements', e)
    }
  }

  useEffect(() => { loadAchievements() }, [])

  const openAchCreate = () => {
    setAchEditingId(null)
    setAchForm({ title: '', description: '', alumniName: '', designation: '', date: new Date().toISOString().split('T')[0], imageFile: null, imagePreview: '' })
    setAchModalOpen(true)
  }

  const handleAchImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAchForm(f => ({ ...f, imageFile: file, imagePreview: reader.result as string }))
      reader.readAsDataURL(file)
    }
  }

  const submitAchievement = async (e?: React.FormEvent) => {
    e?.preventDefault()
    try {
      const fd = new FormData()
      fd.append('title', achForm.title)
      fd.append('description', achForm.description)
      fd.append('alumniName', achForm.alumniName)
      fd.append('designation', achForm.designation)
      fd.append('date', achForm.date)
      if (achForm.imageFile) fd.append('image', achForm.imageFile)
      if (achEditingId) fd.append('id', achEditingId)

      const method = achEditingId ? 'PUT' : 'POST'
      const res = await fetch('/api/achievements', { method, body: fd })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed')
      toast.success(json.message || 'Saved')
      setAchModalOpen(false)
      await loadAchievements()
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to save achievement')
    }
  }

  const editAchievement = (a: any) => {
    setAchEditingId(a.id)
    setAchForm({ title: a.title || '', description: a.description || '', alumniName: a.alumniName || '', designation: a.designation || '', date: a.date ? new Date(a.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], imageFile: null, imagePreview: a.imageUrl || '' })
    setAchModalOpen(true)
  }

  const deleteAchievement = async (id: string) => {
    if (!confirm('Delete this achievement?')) return
    try {
      const res = await fetch(`/api/achievements?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed')
      toast.success('Deleted')
      await loadAchievements()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    }
  }

  // Load user email from localStorage
  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let data = getAlumniByFilters(alumniData, selectedCourses, selectedYears, selectedDepartments)

    // Apply search filter
    if (searchQuery.trim()) {
      data = data.filter(alumni =>
        alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.course.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return data
  }, [alumniData, selectedCourses, selectedYears, selectedDepartments, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    return getAlumniStats(filteredData)
  }, [filteredData])

  // Reset all filters
  const handleReset = () => {
    setSelectedCourses([])
    setSelectedYears([])
    setSelectedDepartments([])
    setSearchQuery("")
  }

  // Show error state
  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b bg-white">
          <div className="flex h-16 items-center px-6">
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
            <div className="ml-4">
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchAlumniData} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Download template and Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Download CSV Template</CardTitle>
              <CardDescription>Use this template to format your data correctly.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <h1 className="text-blue-600 p-2 text-xl sm:text-3xl md:text-4xl font-bold text-center pt-3">Download Template</h1>
              <Button variant="outline" className="mt-6 p-9" asChild>
                <Link className="text-xl" href="https://wqvndanjead1tl5k.public.blob.vercel-storage.com/Data%20Sheet%20Template-ANEzB6xCGkXMbA5avmEQYHD3JONNVB.csv" download>
                  Click here to download
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>Upload your alumni data using the template format.</CardDescription>
            </CardHeader>
            <CardContent>
              <Upload
                onCsvUpload={(data: any) => {
                  console.log("CSV Data:", data)
                  const file = data instanceof ArrayBuffer ? new File([data], "uploaded.csv", { type: "text/csv" }) : data
                  if (file instanceof File) {
                    extractCSV(file).then((csv: any) => {
                      console.log("Extracted CSV:", csv)
                      // Refresh alumni data after upload
                      fetchAlumniData()
                    })
                  } else {
                    console.log("Data is not a File object:", typeof data)
                  }
                }}
                onCsvRemove={() => console.log("CSV Removed")}
                setUploadedCsvName={(name: string | null) => console.log("Uploaded CSV Name:", name)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalAlumni}
              </div>
              <p className="text-xs text-gray-500">Registered alumni</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.departmentStats.length}
              </div>
              <p className="text-xs text-gray-500">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employment Rate</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${stats.employmentRate}%`}
              </div>
              <p className="text-xs text-gray-500">Alumni employed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Year Range</CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                  stats.yearStats.length > 0
                    ? `${Math.min(...stats.yearStats.map((s) => s.year))}-${Math.max(...stats.yearStats.map((s) => s.year))}`
                    : "N/A"
                }
              </div>
              <p className="text-xs text-gray-500">Passing years</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {!loading && (
          <AlumniCharts
            courseStats={stats.courseStats}
            yearStats={stats.yearStats}
            departmentStats={stats.departmentStats}
          />
        )}

        {/* Verification Table */}
        <VerificationTable
          data={filteredData}
          loading={loading}
          onDataUpdate={handleVerificationDataUpdate }
        />

        {/* Analytics Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Alumni Analytics & Directory</h2>
              <p className="text-gray-600">Filter and analyze alumni data with comprehensive insights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <AlumniFilters
                alumniData={alumniData}
                selectedCourses={selectedCourses}
                selectedYears={selectedYears}
                selectedDepartments={selectedDepartments}
                onCoursesChange={setSelectedCourses}
                onYearsChange={setSelectedYears}
                onDepartmentsChange={setSelectedDepartments}
                onReset={handleReset}
              />
            </div>
            

    

            {/* Alumni Table */}
            <div className="lg:col-span-3">
              <AlumniTable data={filteredData} loading={loading} />
            </div>
          </div>

        </div>


      {/* Event Mail sending */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Event Invitation</CardTitle>
              <CardDescription>
                Send event details to all alumni in database via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={() => setIsOpen(true)}>Send Invitation to All Alumni</Button>
            </CardContent>
          </Card>
      

      {/* UPDATED Modal - Added date and location fields */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Event Details</h2>
            <p className="mb-6 text-gray-700 text-center">
              Fill in all event details and send invitation to all alumni in database.
            </p>
            
            {/* Event Title */}
            <input 
              type="text" 
              placeholder="Event Title" 
              className="w-full mb-3 px-3 py-2 border rounded" 
              value={formData.title} 
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
            />
            
            {/* Event Description */}
            <textarea 
              placeholder="Event Description" 
              className="w-full mb-3 px-3 py-2 border rounded" 
              rows={3} 
              value={formData.description} 
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
            />
            
            {/* Event Timing */}
            <input 
              type="text" 
              placeholder="Event Timing (e.g., 10:00 AM - 4:00 PM)" 
              className="w-full mb-3 px-3 py-2 border rounded" 
              value={formData.timing} 
              onChange={(e) => setFormData(prev => ({ ...prev, timing: e.target.value }))} 
            />
            
            {/* ADDED: Event Date */}
            <input 
              type="date" 
              className="w-full mb-3 px-3 py-2 border rounded" 
              value={formData.date} 
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} 
            />
            
            {/* ADDED: Event Location */}
            <input 
              type="text" 
              placeholder="Event Location (e.g., Conference Hall, Building A)" 
              className="w-full mb-4 px-3 py-2 border rounded" 
              value={formData.location} 
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} 
            />

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (optional)</label>
              <input type="file" className="w-full px-3 py-2 border rounded" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt" multiple onChange={handleFiles} />
              
              {attachmentFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachmentFiles.map((file, index) => (
                    <div key={index} className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button type="button" onClick={() => setAttachmentFiles(prev => prev.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 ml-2">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isLoading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Sending emails to database alumni...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsOpen(false); setAttachmentFiles([]); setFormData({ title: "", description: "", timing: "", date: "", location: "" }); }} disabled={isLoading}>Cancel</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-800" onClick={sendEventInvitations} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send to All Alumni"}
              </Button>
            </div>
          </div>
        </div>
      )}</div>
  <Toaster position="top-right" expand richColors closeButton />
  </div>
      </div>
    
  )
}