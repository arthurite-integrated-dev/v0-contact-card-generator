'use client';

import React from "react"

import { useState } from 'react';
import { createContact } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AdminPanelProps {
  onContactAdded: () => void;
}

export default function AdminPanel({ onContactAdded }: AdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    photo_url: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    setUploading(true);
    setError('');
    setUploadProgress(0);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 30;
          return next > 90 ? 90 : next;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to upload image');
        setPhotoPreview(null);
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo_url: data.url,
      }));
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload image. Please try again.');
      setPhotoPreview(null);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.name.trim() || !formData.position.trim() || !formData.email.trim()) {
        setError('Name, position, and email are required');
        setLoading(false);
        return;
      }

      await createContact({
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone || null,
        photo_url: formData.photo_url || null,
      });

      setSuccessMessage(`✓ ${formData.name} has been added successfully!`);
      setSuccess(true);
      setFormData({ name: '', position: '', email: '', phone: '', photo_url: '' });
      setPhotoPreview(null);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        onContactAdded();
      }, 3000);
    } catch (err) {
      console.error('[v0] Error creating contact:', err);
      setError('Failed to add contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-[#1a472a] text-white rounded-t-lg p-6">
        <CardTitle className="text-xl">Add New Staff Member</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., Sales Manager"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@arthurite.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo
            </label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#1a472a] transition cursor-pointer">
                <input
                  type="file"
                  id="photo-upload"
                  name="photo"
                  onChange={handleFileUpload}
                  accept="image/*"
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-[#1a472a] mb-2 animate-spin" />
                      <span className="text-sm text-[#1a472a] font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload a photo</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    </>
                  )}
                </label>
              </div>

              {uploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#1a472a] to-[#2d6a4f] h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center">{Math.round(uploadProgress)}% uploaded</p>
                </div>
              )}

              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData(prev => ({ ...prev, photo_url: '' }));
                      setUploadProgress(0);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              )}
              {formData.photo_url && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700">Photo uploaded successfully</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">{successMessage}</p>
                <p className="text-xs text-green-700 mt-1">ID card is ready to share</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a472a] hover:bg-[#0f3020] text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Contact...
              </>
            ) : (
              'Add Contact'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
