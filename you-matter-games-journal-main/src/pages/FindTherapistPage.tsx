import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample therapist data
const therapists = [
  // Lucknow Therapists
  {
    id: "1",
    name: "Dr. Priya Sharma",
    title: "Clinical Psychologist",
    specialty: ["Anxiety", "Depression", "Stress Management"],
    address: "123 Hazratganj, Lucknow, Uttar Pradesh",
    phone: "(0522) 123-4567",
    email: "priya.sharma@example.com",
    website: "www.priyasharma.com",
    rating: 4.8,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop"
  },
  {
    id: "2",
    name: "Dr. Amit Verma",
    title: "Child Psychologist",
    specialty: ["Child Psychology", "ADHD", "Learning Disabilities"],
    address: "456 Gomti Nagar, Lucknow, Uttar Pradesh",
    phone: "(0522) 234-5678",
    email: "amit.verma@example.com",
    website: "www.amitverma.com",
    rating: 4.7,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop"
  },

  // Delhi Therapists
  {
    id: "3",
    name: "Dr. Rajesh Kumar",
    title: "Licensed Therapist",
    specialty: ["Trauma", "PTSD", "Relationship Issues"],
    address: "456 Connaught Place, New Delhi",
    phone: "(011) 234-5678",
    email: "rajesh.kumar@example.com",
    website: "www.rajeshkumar.com",
    rating: 4.9,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop"
  },
  {
    id: "4",
    name: "Dr. Neha Gupta",
    title: "Marriage Counselor",
    specialty: ["Marriage Counseling", "Family Therapy", "Couples Therapy"],
    address: "789 Saket, New Delhi",
    phone: "(011) 345-6789",
    email: "neha.gupta@example.com",
    website: "www.nehagupta.com",
    rating: 4.6,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
  },

  // Mumbai Therapists
  {
    id: "5",
    name: "Dr. Meera Patel",
    title: "Marriage and Family Therapist",
    specialty: ["Relationships", "Family Therapy", "Couples Counseling"],
    address: "789 MG Road, Mumbai, Maharashtra",
    phone: "(022) 345-6789",
    email: "meera.patel@example.com",
    website: "www.meerapatel.com",
    rating: 4.7,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
  },
  {
    id: "6",
    name: "Dr. Rohan Desai",
    title: "Clinical Psychologist",
    specialty: ["Anxiety", "Depression", "Workplace Stress"],
    address: "101 Bandra West, Mumbai, Maharashtra",
    phone: "(022) 456-7890",
    email: "rohan.desai@example.com",
    website: "www.rohandesai.com",
    rating: 4.8,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop"
  },

  // Bangalore Therapists
  {
    id: "7",
    name: "Dr. Ananya Reddy",
    title: "Clinical Psychologist",
    specialty: ["Anxiety", "Depression", "Workplace Stress"],
    address: "234 Brigade Road, Bangalore, Karnataka",
    phone: "(080) 567-8901",
    email: "ananya.reddy@example.com",
    website: "www.ananyareddy.com",
    rating: 4.9,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop"
  },
  {
    id: "8",
    name: "Dr. Vikram Malhotra",
    title: "Addiction Specialist",
    specialty: ["Addiction", "Substance Abuse", "Behavioral Therapy"],
    address: "567 Koramangala, Bangalore, Karnataka",
    phone: "(080) 678-9012",
    email: "vikram.malhotra@example.com",
    website: "www.vikrammalhotra.com",
    rating: 4.7,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop"
  },

  // Kolkata Therapists
  {
    id: "9",
    name: "Dr. Amit Singh",
    title: "Child Psychologist",
    specialty: ["Child Psychology", "ADHD", "Learning Disabilities"],
    address: "101 Park Street, Kolkata, West Bengal",
    phone: "(033) 456-7890",
    email: "amit.singh@example.com",
    website: "www.amitsingh.com",
    rating: 4.6,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop"
  },
  {
    id: "10",
    name: "Dr. Sonali Banerjee",
    title: "Clinical Psychologist",
    specialty: ["Anxiety", "Depression", "Trauma"],
    address: "234 Salt Lake, Kolkata, West Bengal",
    phone: "(033) 567-8901",
    email: "sonali.banerjee@example.com",
    website: "www.sonalibanerjee.com",
    rating: 4.8,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop"
  },

  // Chennai Therapists
  {
    id: "11",
    name: "Dr. Karthik Iyer",
    title: "Clinical Psychologist",
    specialty: ["Anxiety", "Depression", "Stress Management"],
    address: "123 T Nagar, Chennai, Tamil Nadu",
    phone: "(044) 123-4567",
    email: "karthik.iyer@example.com",
    website: "www.karthikiyer.com",
    rating: 4.7,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop"
  },
  {
    id: "12",
    name: "Dr. Priya Menon",
    title: "Marriage Counselor",
    specialty: ["Marriage Counseling", "Family Therapy", "Relationship Issues"],
    address: "456 Adyar, Chennai, Tamil Nadu",
    phone: "(044) 234-5678",
    email: "priya.menon@example.com",
    website: "www.priyamenon.com",
    rating: 4.9,
    acceptingNew: true,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
  }
];

const specialties = [
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "trauma", label: "Trauma" },
  { value: "relationships", label: "Relationships" },
  { value: "family", label: "Family Therapy" },
  { value: "stress", label: "Stress Management" },
  { value: "child", label: "Child Psychology" },
  { value: "adhd", label: "ADHD" },
  { value: "workplace", label: "Workplace Stress" },
  { value: "addiction", label: "Addiction" },
  { value: "marriage", label: "Marriage Counseling" }
];

const FindTherapistPage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [filteredTherapists, setFilteredTherapists] = useState(therapists);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: ""
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);

    let results = therapists;

    if (location) {
      results = results.filter(therapist => 
        therapist.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (specialty) {
      results = results.filter(therapist => 
        therapist.specialty.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    setFilteredTherapists(results);
  };

  const handleBookAppointment = (therapist) => {
    setSelectedTherapist(therapist);
    setShowAppointmentForm(true);
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the appointment request to your backend
    console.log("Appointment Details:", {
      therapist: selectedTherapist,
      ...appointmentDetails
    });
    
    alert(`Appointment request sent to ${selectedTherapist.name}! They will contact you shortly.`);
    setShowAppointmentForm(false);
    setSelectedTherapist(null);
    setAppointmentDetails({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      message: ""
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Find a Therapist</h1>
      
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Search for Therapists</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter your city (e.g., Lucknow, Delhi, Mumbai)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty (Optional)</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full">Find Therapists</Button>
          </form>
        </CardContent>
      </Card>

      {searchPerformed && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {filteredTherapists.length > 0 
              ? `Found ${filteredTherapists.length} Therapists` 
              : "No therapists found matching your criteria"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map((therapist) => (
              <Card key={therapist.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="flex items-center p-4 border-b">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img src={therapist.imageUrl} alt={therapist.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{therapist.name}</h3>
                    <p className="text-sm text-muted-foreground">{therapist.title}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(therapist.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-1 text-sm">{therapist.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <div className="mb-3">
                    <div className="font-medium text-sm mb-1">Specialties</div>
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialty.map((spec) => (
                        <span key={spec} className="bg-brand-primary/10 px-2 py-1 rounded-full text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{therapist.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{therapist.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{therapist.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{therapist.website}</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="w-full flex justify-between items-center">
                    <span className={`text-sm ${therapist.acceptingNew ? 'text-green-600' : 'text-red-600'}`}>
                      {therapist.acceptingNew ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBookAppointment(therapist)}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showAppointmentForm && selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Book Appointment with {selectedTherapist.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={appointmentDetails.name}
                    onChange={handleAppointmentChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={appointmentDetails.email}
                    onChange={handleAppointmentChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={appointmentDetails.phone}
                    onChange={handleAppointmentChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input 
                    id="preferredDate" 
                    name="preferredDate"
                    type="date" 
                    value={appointmentDetails.preferredDate}
                    onChange={handleAppointmentChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={appointmentDetails.message}
                    onChange={handleAppointmentChange}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Submit Request</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAppointmentForm(false);
                      setSelectedTherapist(null);
                      setAppointmentDetails({
                        name: "",
                        email: "",
                        phone: "",
                        preferredDate: "",
                        message: ""
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-16 text-center">
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          <strong>Disclaimer:</strong> The therapists listed are for demonstration purposes only. 
          In a real application, you would be connected to licensed professionals who have been vetted. 
          Always verify credentials and consult with your healthcare provider before starting any treatment.
        </p>
      </div>
    </div>
  );
};

export default FindTherapistPage;