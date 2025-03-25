"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { useTeam } from "@/contexts/team-context"

type Task = {
  id: string
  title: string
  category: string
  assignee: string
  dueDate: string
  completed: boolean
}

// Pre-populated tasks based on the event agenda
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Secure venue for event",
    category: "Venue",
    assignee: "Team Member 1",
    dueDate: "2025-03-01",
    completed: false,
  },
  {
    id: "2",
    title: "Confirm keynote speaker",
    category: "Speakers",
    assignee: "Team Member 2",
    dueDate: "2025-03-15",
    completed: false,
  },
  {
    id: "3",
    title: "Arrange catering services",
    category: "Catering",
    assignee: "Team Member 3",
    dueDate: "2025-03-20",
    completed: false,
  },
  {
    id: "4",
    title: "Design and print welcome banner",
    category: "Signage",
    assignee: "Team Member 1",
    dueDate: "2025-04-01",
    completed: false,
  },
  {
    id: "5",
    title: "Prepare AI workshop materials",
    category: "Workshop",
    assignee: "Team Member 2",
    dueDate: "2025-04-05",
    completed: false,
  },
  {
    id: "6",
    title: "Coordinate panel discussion participants",
    category: "Speakers",
    assignee: "Team Member 3",
    dueDate: "2025-03-25",
    completed: false,
  },
  {
    id: "7",
    title: "Set up registration system",
    category: "Registration",
    assignee: "Team Member 1",
    dueDate: "2025-03-10",
    completed: false,
  },
  {
    id: "8",
    title: "Create social media promotion plan",
    category: "Marketing",
    assignee: "Team Member 2",
    dueDate: "2025-03-05",
    completed: false,
  },
]

const categories = ["Venue", "Speakers", "Catering", "Signage", "Workshop", "Registration", "Marketing", "Other"]

export default function TaskManager() {
  const { teamMembers } = useTeam()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    category: "Other",
    assignee: teamMembers.length > 0 ? teamMembers[0].name : "",
    dueDate: "",
  })
  const [filter, setFilter] = useState("all")

  // Update default assignee when team members change
  useEffect(() => {
    if (teamMembers.length > 0 && !newTask.assignee) {
      setNewTask((prev) => ({
        ...prev,
        assignee: teamMembers[0].name,
      }))
    }
  }, [teamMembers, newTask.assignee])

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("wtmTasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Failed to parse saved tasks:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wtmTasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      category: "Other",
      assignee: teamMembers.length > 0 ? teamMembers[0].name : "",
      dueDate: "",
    })
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return task.category === filter
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Task Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />

        <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={newTask.assignee} onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.name}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <Button onClick={addTask} size="icon" className="bg-[#2480F0] hover:bg-[#165185]">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-md border ${
              task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                id={`task-${task.id}`}
              />
              <div>
                <label
                  htmlFor={`task-${task.id}`}
                  className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}
                >
                  {task.title}
                </label>
                <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-2">
                  <span>{task.category}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{task.assignee}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
              <Trash2 className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">No tasks found. Add some tasks to get started!</div>
        )}
      </div>
    </div>
  )
}

