"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Building, Phone, Mail } from "lucide-react"

type Vendor = {
  id: string
  name: string
  category: string
  contactPerson: string
  phone: string
  email: string
  notes: string
  status: "pending" | "confirmed" | "paid"
}

// Pre-populated vendors
const initialVendors: Vendor[] = [
  {
    id: "1",
    name: "Conference Center",
    category: "Venue",
    contactPerson: "Venue Manager",
    phone: "123-456-7890",
    email: "venue@example.com",
    notes: "Main hall and 2 breakout rooms reserved. Deposit paid.",
    status: "confirmed",
  },
  {
    id: "2",
    name: "Catering Services",
    category: "Catering",
    contactPerson: "Catering Manager",
    phone: "123-456-7891",
    email: "catering@example.com",
    notes: "Menu includes vegetarian and vegan options. Final headcount needed 1 week before event.",
    status: "pending",
  },
  {
    id: "3",
    name: "Print Shop",
    category: "Signage",
    contactPerson: "Print Manager",
    phone: "123-456-7892",
    email: "print@example.com",
    notes: "Designs to be submitted 2 weeks before event for production.",
    status: "pending",
  },
]

const vendorCategories = ["Venue", "Catering", "Signage", "Audio/Visual", "Photography", "Transportation", "Other"]

export default function VendorTracker() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [newVendor, setNewVendor] = useState<Omit<Vendor, "id">>({
    name: "",
    category: vendorCategories[0],
    contactPerson: "",
    phone: "",
    email: "",
    notes: "",
    status: "pending",
  })
  const [filter, setFilter] = useState("all")

  const addVendor = () => {
    if (!newVendor.name) return

    const vendor: Vendor = {
      id: Date.now().toString(),
      ...newVendor,
    }

    setVendors([...vendors, vendor])
    setNewVendor({
      name: "",
      category: vendorCategories[0],
      contactPerson: "",
      phone: "",
      email: "",
      notes: "",
      status: "pending",
    })
  }

  const deleteVendor = (id: string) => {
    setVendors(vendors.filter((vendor) => vendor.id !== id))
  }

  const updateVendorStatus = (id: string, status: Vendor["status"]) => {
    setVendors(vendors.map((vendor) => (vendor.id === id ? { ...vendor, status } : vendor)))
  }

  const filteredVendors = vendors.filter((vendor) => {
    if (filter === "all") return true
    if (filter === "pending" || filter === "confirmed" || filter === "paid") {
      return vendor.status === filter
    }
    return vendor.category === filter
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vendor Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <Input
            placeholder="Vendor name"
            value={newVendor.name}
            onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
          />

          <Select value={newVendor.category} onValueChange={(value) => setNewVendor({ ...newVendor, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {vendorCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Contact person"
            value={newVendor.contactPerson}
            onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Phone number"
              value={newVendor.phone}
              onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
            />

            <Input
              placeholder="Email address"
              type="email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Notes (requirements, deadlines, etc.)"
            value={newVendor.notes}
            onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
            className="flex-grow"
          />

          <Select
            value={newVendor.status}
            onValueChange={(value: Vendor["status"]) => setNewVendor({ ...newVendor, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={addVendor} className="self-end">
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter vendors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            {vendorCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`border rounded-lg p-6 ${
              vendor.status === "confirmed"
                ? "border-blue-200 bg-blue-50"
                : vendor.status === "paid"
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-gray-500" />
                  <h3 className="font-semibold text-lg">{vendor.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">{vendor.category}</p>
              </div>

              <div className="flex items-center gap-2">
                <Select value={vendor.status} onValueChange={(value: Vendor["status"]) => updateVendorStatus(vendor.id, value)}>
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="ghost" size="icon" onClick={() => deleteVendor(vendor.id)}>
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium">Contact: {vendor.contactPerson}</p>
              <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
              </div>
            </div>

            {vendor.notes && (
              <div className="mt-4 p-3 bg-white rounded border border-gray-100">
                <p className="text-sm text-gray-500">{vendor.notes}</p>
              </div>
            )}
          </div>
        ))}

        {filteredVendors.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No vendors found. Add some vendors to get started!
          </div>
        )}
      </div>
    </div>
  )
}

