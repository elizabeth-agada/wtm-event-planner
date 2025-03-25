"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, Clock } from "lucide-react"

type TimelineItem = {
  id: string
  date: string
  title: string
  description: string
}

// Pre-populated timeline based on the event planning milestones
const initialTimeline: TimelineItem[] = [
  {
    id: "1",
    date: "2025-02-15",
    title: "Initial Planning Meeting",
    description: "Kick-off meeting to discuss event goals, target audience, and initial budget planning.",
  },
  {
    id: "2",
    date: "2025-03-01",
    title: "Venue Confirmation",
    description: "Finalize venue booking and confirm space requirements for all activities.",
  },
  {
    id: "3",
    date: "2025-03-15",
    title: "Speaker Confirmations",
    description: "Confirm all speakers for keynote, panel discussion, and fireside chat.",
  },
  {
    id: "4",
    date: "2025-03-25",
    title: "Marketing Launch",
    description: "Launch event registration and begin social media promotion.",
  },
  {
    id: "5",
    date: "2025-04-05",
    title: "Final Planning Meeting",
    description: "Review all arrangements, confirm final attendee count, and address any outstanding issues.",
  },
  {
    id: "6",
    date: "2025-04-19",
    title: "Event Day",
    description: "Women TechMakers IWD 2025 event from 10:00 AM to 4:00 PM.",
  },
  {
    id: "7",
    date: "2025-04-26",
    title: "Post-Event Review",
    description: "Evaluate event success, review feedback, and document lessons learned for future events.",
  },
]

export default function Timeline() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(initialTimeline)
  const [newItem, setNewItem] = useState<Omit<TimelineItem, "id">>({
    date: "",
    title: "",
    description: "",
  })

  // Load timeline items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("wtmTimelineItems")
    if (savedItems) {
      try {
        setTimelineItems(JSON.parse(savedItems))
      } catch (error) {
        console.error("Failed to parse saved timeline items:", error)
      }
    }
  }, [])

  // Save timeline items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wtmTimelineItems", JSON.stringify(timelineItems))
  }, [timelineItems])

  const addTimelineItem = () => {
    if (!newItem.date || !newItem.title) return

    const item: TimelineItem = {
      id: Date.now().toString(),
      ...newItem,
    }

    setTimelineItems([...timelineItems, item])
    setNewItem({
      date: "",
      title: "",
      description: "",
    })
  }

  const deleteTimelineItem = (id: string) => {
    setTimelineItems(timelineItems.filter((item) => item.id !== id))
  }

  // Sort timeline items by date
  const sortedTimeline = [...timelineItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Event Timeline</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input type="date" value={newItem.date} onChange={(e) => setNewItem({ ...newItem, date: e.target.value })} />
        <Input
          placeholder="Milestone title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
        />
        <div className="flex gap-2">
          <Textarea
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="min-h-[40px]"
          />
          <Button onClick={addTimelineItem} size="icon" className="flex-shrink-0 bg-[#2480F0] hover:bg-[#165185]">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative border-l-2 border-[#2480F0] pl-6 ml-4 space-y-10">
        {sortedTimeline.map((item, index) => (
          <div key={item.id} className="relative">
            <div className="absolute -left-[30px] bg-[#2480F0] text-white rounded-full p-1">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <time className="text-sm font-medium text-gray-500">
                  {new Date(item.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteTimelineItem(item.id)}>
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        ))}

        {timelineItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No timeline items yet. Add some milestones to get started!
          </div>
        )}
      </div>
    </div>
  )
}

