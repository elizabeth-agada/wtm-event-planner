"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Download } from "lucide-react"

type BudgetItem = {
  id: string
  category: string
  description: string
  amount: number
  status: "planned" | "approved" | "spent"
}

// Pre-populated budget items based on the event budget request
const initialBudget: BudgetItem[] = [
  {
    id: "1",
    category: "Signage",
    description: "Welcome banner with event theme",
    amount: 200,
    status: "planned",
  },
  {
    id: "2",
    category: "Signage",
    description: "Directional signage for venue navigation",
    amount: 150,
    status: "planned",
  },
  {
    id: "3",
    category: "Signage",
    description: "Workshop session signage",
    amount: 100,
    status: "planned",
  },
  {
    id: "4",
    category: "Signage",
    description: "Photo backdrop for social media engagement",
    amount: 250,
    status: "planned",
  },
  {
    id: "5",
    category: "Signage",
    description: "Printed material for interactive displays",
    amount: 150,
    status: "planned",
  },
  {
    id: "6",
    category: "Catering",
    description: "Morning refreshments",
    amount: 150,
    status: "planned",
  },
  {
    id: "7",
    category: "Catering",
    description: "Lunch for participants",
    amount: 350,
    status: "planned",
  },
  {
    id: "8",
    category: "Catering",
    description: "Service and setup",
    amount: 50,
    status: "planned",
  },
  {
    id: "9",
    category: "Catering",
    description: "Disposable supplies",
    amount: 50,
    status: "planned",
  },
  {
    id: "10",
    category: "Venue",
    description: "Main conference space",
    amount: 400,
    status: "planned",
  },
  {
    id: "11",
    category: "Venue",
    description: "Workshop breakout areas",
    amount: 150,
    status: "planned",
  },
  {
    id: "12",
    category: "Venue",
    description: "Setup and cleanup time",
    amount: 50,
    status: "planned",
  },
  {
    id: "13",
    category: "Venue",
    description: "Basic furniture needs",
    amount: 50,
    status: "planned",
  },
  {
    id: "14",
    category: "Venue",
    description: "Utility costs",
    amount: 50,
    status: "planned",
  },
]

const categories = ["Venue", "Catering", "Signage", "Marketing", "Speakers", "Workshop Materials", "Other"]

export default function BudgetTracker() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudget)
  const [newItem, setNewItem] = useState<Omit<BudgetItem, "id">>({
    category: categories[0],
    description: "",
    amount: 0,
    status: "planned",
  })
  const [filter, setFilter] = useState("all")

  // Load budget items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("wtmBudgetItems")
    if (savedItems) {
      try {
        setBudgetItems(JSON.parse(savedItems))
      } catch (error) {
        console.error("Failed to parse saved budget items:", error)
      }
    }
  }, [])

  // Save budget items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wtmBudgetItems", JSON.stringify(budgetItems))
  }, [budgetItems])

  const addBudgetItem = () => {
    if (!newItem.description || newItem.amount <= 0) return

    const item: BudgetItem = {
      id: Date.now().toString(),
      ...newItem,
    }

    setBudgetItems([...budgetItems, item])
    setNewItem({
      category: categories[0],
      description: "",
      amount: 0,
      status: "planned",
    })
  }

  const deleteBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id))
  }

  const updateItemStatus = (id: string, status: BudgetItem["status"]) => {
    setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const filteredItems = budgetItems.filter((item) => {
    if (filter === "all") return true
    if (filter === "planned" || filter === "approved" || filter === "spent") {
      return item.status === filter
    }
    return item.category === filter
  })

  // Calculate totals
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0)
  const approvedBudget = budgetItems
    .filter((item) => item.status === "approved" || item.status === "spent")
    .reduce((sum, item) => sum + item.amount, 0)
  const spentBudget = budgetItems.filter((item) => item.status === "spent").reduce((sum, item) => sum + item.amount, 0)

  // Calculate category totals
  const categoryTotals = categories.map((category) => {
    const total = budgetItems.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0)
    return { category, total }
  })

  // Export budget as CSV
  const exportBudgetCSV = () => {
    const headers = ["Category", "Description", "Amount", "Status"]
    const csvRows = [headers.join(",")]

    budgetItems.forEach((item) => {
      const row = [`"${item.category}"`, `"${item.description}"`, item.amount, `"${item.status}"`]
      csvRows.push(row.join(","))
    })

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "wtm-budget.csv")
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Budget Tracker</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#CAE6FF] p-4 rounded-lg">
          <p className="text-sm text-[#165185]">Total Budget</p>
          <p className="text-2xl font-bold text-[#165185]">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-[#54A7ED] p-4 rounded-lg">
          <p className="text-sm text-white">Approved</p>
          <p className="text-2xl font-bold text-white">${approvedBudget.toFixed(2)}</p>
        </div>
        <div className="bg-[#00B698] p-4 rounded-lg">
          <p className="text-sm text-white">Spent</p>
          <p className="text-2xl font-bold text-white">${spentBudget.toFixed(2)}</p>
        </div>
        <div className="bg-[#E4C472] p-4 rounded-lg">
          <p className="text-sm text-[#202124]">Remaining</p>
          <p className="text-2xl font-bold text-[#202124]">${(totalBudget - spentBudget).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={exportBudgetCSV}
          className="text-[#165185] border-[#165185] hover:bg-[#CAE6FF] hover:text-[#165185]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select value={newItem.category} onValueChange={(value: string) => setNewItem({ ...newItem, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: string) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Description"
          value={newItem.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, description: e.target.value })}
        />

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Amount ($)"
            value={newItem.amount === 0 ? "" : newItem.amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItem({ ...newItem, amount: Number.parseFloat(e.target.value) || 0 })
            }
          />
          <Button onClick={addBudgetItem} size="icon" className="bg-[#2480F0] hover:bg-[#165185]">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter budget items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="spent">Spent</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#CAE6FF]">
              <th className="text-left p-3 border text-[#165185]">Category</th>
              <th className="text-left p-3 border text-[#165185]">Description</th>
              <th className="text-right p-3 border text-[#165185]">Amount</th>
              <th className="text-center p-3 border text-[#165185]">Status</th>
              <th className="text-center p-3 border text-[#165185]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 border">{item.category}</td>
                <td className="p-3 border">{item.description}</td>
                <td className="p-3 border text-right">${item.amount.toFixed(2)}</td>
                <td className="p-3 border">
                  <Select value={item.status} onValueChange={(value: BudgetItem["status"]) => updateItemStatus(item.id, value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="spent">Spent</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 border text-center">
                  <Button variant="ghost" size="icon" onClick={() => deleteBudgetItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No budget items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Budget Breakdown by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryTotals.map((item) => (
            <div key={item.category} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-xl font-bold text-[#165185]">${item.total.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{Math.round((item.total / totalBudget) * 100)}% of total budget</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

