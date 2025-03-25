"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Calendar, CheckCircle2 } from "lucide-react"
import { useTeam } from "@/contexts/team-context"

type MarketingTask = {
  id: string
  channel: string
  task: string
  dueDate: string
  assignee: string
  status: "planned" | "in-progress" | "completed"
}

// Pre-populated marketing tasks
const initialTasks: MarketingTask[] = [
  {
    id: "1",
    channel: "Social Media",
    task: "Create event announcement graphics",
    dueDate: "2025-03-01",
    assignee: "Team Member 2",
    status: "planned",
  },
  {
    id: "2",
    channel: "Email",
    task: "Draft and send initial event invitation",
    dueDate: "2025-03-05",
    assignee: "Team Member 1",
    status: "planned",
  },
  {
    id: "3",
    channel: "Website",
    task: "Update community website with event details",
    dueDate: "2025-03-03",
    assignee: "Team Member 3",
    status: "planned",
  },
  {
    id: "4",
    channel: "Social Media",
    task: "Schedule weekly promotional posts",
    dueDate: "2025-03-10",
    assignee: "Team Member 2",
    status: "planned",
  },
  {
    id: "5",
    channel: "Partners",
    task: "Reach out to local tech companies for promotion",
    dueDate: "2025-03-15",
    assignee: "Team Member 1",
    status: "planned",
  },
  {
    id: "6",
    channel: "Email",
    task: "Send reminder email to registered participants",
    dueDate: "2025-04-12",
    assignee: "Team Member 3",
    status: "planned",
  },
]

const channels = ["Social Media", "Email", "Website", "Partners", "Press", "Flyers/Posters", "Other"]

export default function MarketingPlan() {
  const { teamMembers } = useTeam()
  const [marketingTasks, setMarketingTasks] = useState<MarketingTask[]>(initialTasks)
  const [newTask, setNewTask] = useState<Omit<MarketingTask, "id">>({
    channel: channels[0],
    task: "",
    dueDate: "",
    assignee: teamMembers.length > 0 ? teamMembers[0].name : "",
    status: "planned",
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

  // Load marketing tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("wtmMarketingTasks")
    if (savedTasks) {
      try {
        setMarketingTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Failed to parse saved marketing tasks:", error)
      }
    }
  }, [])

  // Save marketing tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wtmMarketingTasks", JSON.stringify(marketingTasks))
  }, [marketingTasks])

  const addMarketingTask = () => {
    if (!newTask.task || !newTask.dueDate) return

    const task: MarketingTask = {
      id: Date.now().toString(),
      ...newTask,
    }

    setMarketingTasks([...marketingTasks, task])
    setNewTask({
      channel: channels[0],
      task: "",
      dueDate: "",
      assignee: teamMembers.length > 0 ? teamMembers[0].name : "",
      status: "planned",
    })
  }

  const deleteMarketingTask = (id: string) => {
    setMarketingTasks(marketingTasks.filter((task) => task.id !== id))
  }

  const updateTaskStatus = (id: string, status: MarketingTask["status"]) => {
    setMarketingTasks(marketingTasks.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  const filteredTasks = marketingTasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "planned" || filter === "in-progress" || filter === "completed") {
      return task.status === filter
    }
    return task.channel === filter
  })

  // Sort tasks by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Marketing Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <Select value={newTask.channel} onValueChange={(value) => setNewTask({ ...newTask, channel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel} value={channel}>
                  {channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Marketing task description"
            value={newTask.task}
            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />

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
          </div>

          <Select value={newTask.status} onValueChange={(value: MarketingTask["status"]) => setNewTask({ ...newTask, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={addMarketingTask} className="w-full bg-[#2480F0] hover:bg-[#165185]">
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Marketing Task
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter marketing tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel} value={channel}>
                {channel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`border rounded-lg p-4 ${
              task.status === "in-progress"
                ? "border-blue-200 bg-blue-50"
                : task.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">{task.channel}</span>
                  <time className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</time>
                </div>
                <h3 className="font-medium mt-2">{task.task}</h3>
                <p className="text-sm text-gray-500 mt-1">Assigned to: {task.assignee}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Select value={task.status} onValueChange={(value: MarketingTask["status"]) => updateTaskStatus(task.id, value)}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="ghost" size="icon" onClick={() => deleteMarketingTask(task.id)}>
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">No marketing tasks found. Add some tasks to get started!</div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Marketing Timeline</h3>
        <div className="relative border-l-2 border-[#2480F0] pl-6 ml-4 space-y-8">
          {sortedTasks.map((task) => (
            <div key={task.id} className="relative">
              <div
                className={`absolute -left-[30px] rounded-full p-1 ${
                  task.status === "completed" ? "bg-[#00B698]" : "bg-[#2480F0]"
                }`}
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <Calendar className="h-5 w-5 text-white" />
                )}
              </div>
              <time className="text-sm font-medium text-gray-500">
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h4 className="text-base font-medium">{task.task}</h4>
              <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                <span>{task.channel}</span>
                <span>•</span>
                <span>{task.assignee}</span>
                <span>•</span>
                <span className="capitalize">{task.status.replace("-", " ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

