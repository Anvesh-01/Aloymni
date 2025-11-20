// app/adminDashboard/achievements/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  image: string;
  alumniName: string;
  alumniDesignation: string;
  createdAt: string;
  updatedAt: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    alumniName: "",
    alumniDesignation: "",
  });

  // Fetch achievements
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/achievements");
      const data = await response.json();

      if (data.success) {
        setAchievements(data.achievements);
      } else {
        toast.error("Failed to fetch achievements");
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.image || 
        !formData.alumniName || !formData.alumniDesignation) {
      toast.error("All fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = "/api/achievements";
      const method = editingAchievement ? "PUT" : "POST";
      const body = editingAchievement
        ? { ...formData, id: editingAchievement._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchAchievements();
        handleCloseModal();
      } else {
        toast.error(data.error || "Failed to save achievement");
      }
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast.error("Failed to save achievement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const response = await fetch(`/api/achievements?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchAchievements();
      } else {
        toast.error(data.error || "Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Failed to delete achievement");
    }
  };

  // Handle edit
  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      image: achievement.image,
      alumniName: achievement.alumniName,
      alumniDesignation: achievement.alumniDesignation,
    });
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAchievement(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      alumniName: "",
      alumniDesignation: "",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-2xl font-semibold">Achievements</h1>
          </div>
          <div className="ml-auto">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : achievements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                No achievements yet
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Start by adding your first achievement
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement._id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={achievement.image}
                    alt={achievement.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(achievement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(achievement._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {achievement.description}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline">{achievement.alumniName}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {achievement.alumniDesignation}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(achievement.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingAchievement ? "Edit Achievement" : "Add Achievement"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseModal}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="image">Achievement Image *</Label>
                  <div className="mt-2">
                    {formData.image ? (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={formData.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, image: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <Label
                          htmlFor="imageUpload"
                          className="cursor-pointer text-blue-600 hover:text-blue-700"
                        >
                          Click to upload image
                        </Label>
                        <Input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter achievement title"
                    className="mt-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter achievement description"
                    rows={4}
                    className="mt-2"
                  />
                </div>

                {/* Alumni Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alumniName">Alumni Name *</Label>
                    <Input
                      id="alumniName"
                      value={formData.alumniName}
                      onChange={(e) =>
                        setFormData({ ...formData, alumniName: e.target.value })
                      }
                      placeholder="Enter alumni name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alumniDesignation">Designation *</Label>
                    <Input
                      id="alumniDesignation"
                      value={formData.alumniDesignation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alumniDesignation: e.target.value,
                        })
                      }
                      placeholder="Enter designation"
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingAchievement ? "Update" : "Create"} Achievement
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}