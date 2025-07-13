import { useState } from "react";
import { Calendar, Filter, Plus, X, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FilterSidebar = () => {
  const [labels, setLabels] = useState([
    { id: 1, name: "Hot Leads", color: "bg-red-500", count: 12 },
    { id: 2, name: "Qualified", color: "bg-green-500", count: 8 },
    { id: 3, name: "Follow Up", color: "bg-yellow-500", count: 15 },
    { id: 4, name: "Enterprise", color: "bg-purple-500", count: 5 },
  ]);
  
  const [newLabelName, setNewLabelName] = useState("");
  const [showNewLabelInput, setShowNewLabelInput] = useState(false);

  const addLabel = () => {
    if (newLabelName.trim()) {
      const colors = ["bg-blue-500", "bg-indigo-500", "bg-pink-500", "bg-orange-500"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setLabels([...labels, {
        id: Date.now(),
        name: newLabelName.trim(),
        color: randomColor,
        count: 0
      }]);
      setNewLabelName("");
      setShowNewLabelInput(false);
    }
  };

  const removeLabel = (id: number) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Filters & Labels</h2>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Visitors</span>
              <span className="font-medium text-metric-positive">+24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Companies</span>
              <span className="font-medium">186</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Page Views</span>
              <span className="font-medium">1,247</span>
            </div>
          </CardContent>
        </Card>

        {/* Date Range Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Label>
          <Select defaultValue="last-7-days">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Company Size Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Company Size</Label>
          <div className="space-y-2">
            {["1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"].map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox id={size} />
                <label htmlFor={size} className="text-sm text-muted-foreground cursor-pointer">{size}</label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Industry Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Industry</Label>
          <div className="space-y-2">
            {["Technology", "Healthcare", "Finance", "E-commerce", "Manufacturing", "Education"].map((industry) => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox id={industry} />
                <label htmlFor={industry} className="text-sm text-muted-foreground cursor-pointer">{industry}</label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Visit Behavior */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Visit Behavior</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="first-time" />
              <label htmlFor="first-time" className="text-sm text-muted-foreground cursor-pointer">First-time visitors</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="returning" />
              <label htmlFor="returning" className="text-sm text-muted-foreground cursor-pointer">Returning visitors</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="high-engagement" />
              <label htmlFor="high-engagement" className="text-sm text-muted-foreground cursor-pointer">High engagement</label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Labels Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Labels
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowNewLabelInput(true)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* New Label Input */}
          {showNewLabelInput && (
            <div className="space-y-2">
              <Input
                placeholder="Label name"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
                className="h-8"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={addLabel} className="h-7 text-xs">
                  Add
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowNewLabelInput(false);
                    setNewLabelName("");
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Labels */}
          <div className="space-y-2">
            {labels.map((label) => (
              <div key={label.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${label.color}`} />
                  <span className="text-sm">{label.name}</span>
                  <Badge variant="secondary" className="text-xs h-5">
                    {label.count}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLabel(label.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <Button variant="outline" className="w-full">
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};
