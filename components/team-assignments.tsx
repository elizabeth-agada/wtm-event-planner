"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Download, Upload } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTeam, type TeamMember } from "@/contexts/team-context"

const roles = [
  "Event Lead",
  "Content Coordinator",
  "Logistics Manager",
  "Marketing Coordinator",
  "Technical Support",
  "Volunteer Coordinator",
  "Other",
]

export default function TeamAssignments() {
  const { teamMembers, addTeamMember, deleteTeamMember, setTeamMembers } = useTeam()

  const [newMember, setNewMember] = useState<Omit<TeamMember, "id">>({
    name: "",
    role: roles[0],
    email: "",
    responsibilities: "",
  })

  const handleAddTeamMember = () => {
    if (!newMember.name) return

    addTeamMember(newMember)

    setNewMember({
      name: "",
      role: roles[0],
      email: "",
      responsibilities: "",
    })
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Export team members as JSON file
  const exportTeamMembers = () => {
    const dataStr = JSON.stringify(teamMembers, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "wtm-team-members.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import team members from JSON file
  const importTeamMembers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0], "UTF-8")
      fileReader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          try {
            const imported = JSON.parse(e.target.result)
            if (Array.isArray(imported)) {
              setTeamMembers(imported)
            }
          } catch (error) {
            console.error("Failed to parse imported team members:", error)
            alert("Invalid file format. Please upload a valid JSON file.")
          }
        }
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Team Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <Input
            placeholder="Team member name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          />

          <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Email address"
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Key responsibilities"
            value={newMember.responsibilities}
            onChange={(e) => setNewMember({ ...newMember, responsibilities: e.target.value })}
            className="flex-grow"
          />

          <Button onClick={handleAddTeamMember} className="self-end bg-[#2480F0] hover:bg-[#165185]">
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Team Members ({teamMembers.length})</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportTeamMembers}
            className="text-[#165185] border-[#165185] hover:bg-[#CAE6FF] hover:text-[#165185]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Team
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="text-[#165185] border-[#165185] hover:bg-[#CAE6FF] hover:text-[#165185]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Team
            </Button>
            <input id="file-upload" type="file" accept=".json" onChange={importTeamMembers} className="hidden" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 bg-[#2480F0] text-white">
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteTeamMember(member.id)}>
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm">{member.email}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Responsibilities</p>
              <p className="text-sm mt-1">{member.responsibilities}</p>
            </div>
          </div>
        ))}

        {teamMembers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No team members added yet. Add team members to get started!
          </div>
        )}
      </div>
    </div>
  )
}

