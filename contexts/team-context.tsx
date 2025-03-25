"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type TeamMember = {
  id: string
  name: string
  role: string
  email: string
  responsibilities: string
}

// Initial team members as fallback
const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Team Member 1",
    role: "Event Lead",
    email: "lead@example.com",
    responsibilities: "Overall event coordination, budget management, stakeholder communication",
  },
  {
    id: "2",
    name: "Team Member 2",
    role: "Content Coordinator",
    email: "content@example.com",
    responsibilities: "Speaker coordination, workshop content, panel discussion facilitation",
  },
  {
    id: "3",
    name: "Team Member 3",
    role: "Logistics Manager",
    email: "logistics@example.com",
    responsibilities: "Venue setup, catering coordination, signage and materials",
  },
]

type TeamContextType = {
  teamMembers: TeamMember[]
  setTeamMembers: (members: TeamMember[]) => void
  addTeamMember: (member: Omit<TeamMember, "id">) => void
  deleteTeamMember: (id: string) => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load team members from localStorage on component mount
  useEffect(() => {
    const savedTeamMembers = localStorage.getItem("wtmTeamMembers")
    if (savedTeamMembers) {
      try {
        const parsed = JSON.parse(savedTeamMembers)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeamMembers(parsed)
        }
      } catch (error) {
        console.error("Failed to parse saved team members:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save team members to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("wtmTeamMembers", JSON.stringify(teamMembers))
    }
  }, [teamMembers, isInitialized])

  const addTeamMember = (member: Omit<TeamMember, "id">) => {
    if (!member.name) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...member,
    }

    setTeamMembers((prev) => [...prev, newMember])
  }

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id))
  }

  return (
    <TeamContext.Provider value={{ teamMembers, setTeamMembers, addTeamMember, deleteTeamMember }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider")
  }
  return context
}

