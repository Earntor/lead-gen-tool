import { useState } from "react";
import { Building2, Globe, Clock, TrendingUp, Eye, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Company {
  id: number;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  lastVisit: string;
  pageViews: number;
  timeOnSite: string;
  status: "hot" | "warm" | "cold";
  isNew: boolean;
  labels: string[];
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: "TechCorp Solutions",
    domain: "techcorp.com",
    industry: "Technology",
    size: "201-1000",
    location: "San Francisco, CA",
    lastVisit: "2 min ago",
    pageViews: 12,
    timeOnSite: "8m 34s",
    status: "hot",
    isNew: true,
    labels: ["Hot Leads", "Enterprise"]
  },
  {
    id: 2,
    name: "Healthcare Partners",
    domain: "healthpartners.org",
    industry: "Healthcare",
    size: "51-200",
    location: "Boston, MA",
    lastVisit: "15 min ago",
    pageViews: 7,
    timeOnSite: "5m 22s",
    status: "warm",
    isNew: false,
    labels: ["Qualified"]
  },
  {
    id: 3,
    name: "Global Manufacturing",
    domain: "globalmfg.com",
    industry: "Manufacturing",
    size: "1000+",
    location: "Detroit, MI",
    lastVisit: "32 min ago",
    pageViews: 15,
    timeOnSite: "12m 18s",
    status: "hot",
    isNew: false,
    labels: ["Enterprise", "Follow Up"]
  },
  {
    id: 4,
    name: "StartupXYZ",
    domain: "startupxyz.io",
    industry: "Technology",
    size: "11-50",
    location: "Austin, TX",
    lastVisit: "1h ago",
    pageViews: 4,
    timeOnSite: "3m 45s",
    status: "warm",
    isNew: true,
    labels: []
  },
  {
    id: 5,
    name: "Education Solutions Inc",
    domain: "edusolutions.edu",
    industry: "Education",
    size: "201-1000",
    location: "Chicago, IL",
    lastVisit: "2h ago",
    pageViews: 9,
    timeOnSite: "7m 12s",
    status: "cold",
    isNew: false,
    labels: ["Follow Up"]
  }
];

interface CompanyListProps {
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
}

export const CompanyList = ({ selectedCompany, onSelectCompany }: CompanyListProps) => {
  const [sortBy, setSortBy] = useState<"lastVisit" | "pageViews" | "timeOnSite">("lastVisit");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-red-500";
      case "warm": return "bg-yellow-500";
      case "cold": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getLabelColor = (label: string) => {
    const colors = {
      "Hot Leads": "bg-red-100 text-red-800",
      "Qualified": "bg-green-100 text-green-800",
      "Follow Up": "bg-yellow-100 text-yellow-800",
      "Enterprise": "bg-purple-100 text-purple-800",
    };
    return colors[label as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex-1 bg-muted/30 overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Website Visitors</h2>
            <p className="text-sm text-muted-foreground">
              {mockCompanies.length} companies • {mockCompanies.filter(c => c.isNew).length} new today
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "lastVisit" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("lastVisit")}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === "pageViews" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("pageViews")}
            >
              Most Active
            </Button>
            <Button
              variant={sortBy === "timeOnSite" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("timeOnSite")}
            >
              Engaged
            </Button>
          </div>
        </div>
      </div>

      {/* Company List */}
      <div className="overflow-y-auto h-full pb-4">
        <div className="p-4 space-y-3">
          {mockCompanies.map((company) => (
            <Card 
              key={company.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCompany?.id === company.id 
                  ? "ring-2 ring-primary shadow-md" 
                  : "hover:bg-accent/50"
              }`}
              onClick={() => onSelectCompany(company)}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      {company.isNew && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm leading-tight">{company.name}</h3>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)}`} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Globe className="h-3 w-3" />
                        {company.domain}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {company.lastVisit}
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {company.size}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {company.location}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {company.industry}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{company.pageViews}</span>
                      <span className="text-muted-foreground">pages</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{company.timeOnSite}</span>
                      <span className="text-muted-foreground">duration</span>
                    </div>
                  </div>
                </div>

                {/* Labels */}
                {company.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {company.labels.map((label, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className={`text-xs ${getLabelColor(label)}`}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};