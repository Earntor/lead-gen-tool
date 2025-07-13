import { Building2, Globe, MapPin, Users, Phone, Mail, Clock, Eye, TrendingUp, ExternalLink, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

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

interface CompanyDetailsProps {
  company: Company | null;
}

// Mock data for detailed company info and visited pages
const getCompanyDetails = (company: Company | null) => {
  if (!company) return null;
  
  return {
    ...company,
    description: "Leading technology solutions provider specializing in enterprise software development and digital transformation services.",
    phone: "+1 (555) 123-4567",
    email: "contact@" + company.domain,
    employees: "~500",
    founded: "2015",
    revenue: "$50M - $100M",
    address: "123 Tech Street, " + company.location,
    website: "https://" + company.domain,
    socialScore: 85,
    engagementScore: 92,
    visitedPages: [
      { page: "/pricing", views: 5, time: "2m 34s", timestamp: "2 min ago" },
      { page: "/features/enterprise", views: 3, time: "1m 45s", timestamp: "5 min ago" },
      { page: "/demo", views: 2, time: "3m 12s", timestamp: "8 min ago" },
      { page: "/about", views: 1, time: "45s", timestamp: "12 min ago" },
      { page: "/contact", views: 1, time: "1m 23s", timestamp: "15 min ago" }
    ]
  };
};

export const CompanyDetails = ({ company }: CompanyDetailsProps) => {
  const details = getCompanyDetails(company);

  if (!details) {
    return (
      <div className="w-96 bg-card border-l border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a company to view details</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "text-red-600 bg-red-50";
      case "warm": return "text-yellow-600 bg-yellow-50";
      case "cold": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
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
    <div className="w-96 bg-card border-l border-border overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Company Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-tight">{details.name}</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Globe className="h-3 w-3" />
                  <a href={details.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {details.domain}
                  </a>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(details.status)} border-0`}>
              {details.status.toUpperCase()}
            </Badge>
          </div>

          {/* Labels */}
          {details.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {details.labels.map((label, index) => (
                <Badge key={index} variant="secondary" className={`text-xs ${getLabelColor(label)}`}>
                  <Tag className="h-3 w-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">Add Label</Button>
            <Button variant="outline" size="sm" className="flex-1">Add Note</Button>
          </div>
        </div>

        <Separator />

        {/* Company Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{details.description}</p>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Industry</span>
                <p className="font-medium">{details.industry}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Size</span>
                <p className="font-medium">{details.size} employees</p>
              </div>
              <div>
                <span className="text-muted-foreground">Founded</span>
                <p className="font-medium">{details.founded}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Revenue</span>
                <p className="font-medium">{details.revenue}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{details.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{details.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${details.email}`} className="text-primary hover:underline">
                  {details.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Map Placeholder */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded-md flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs">Map View</p>
                <p className="text-xs">{details.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{details.pageViews}</div>
                <div className="text-xs text-muted-foreground">Page Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{details.timeOnSite}</div>
                <div className="text-xs text-muted-foreground">Time on Site</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Social Score</span>
                  <span className="font-medium">{details.socialScore}%</span>
                </div>
                <Progress value={details.socialScore} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-medium">{details.engagementScore}%</span>
                </div>
                <Progress value={details.engagementScore} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visited Pages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Page Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {details.visitedPages.map((visit, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{visit.page}</span>
                      <Badge variant="outline" className="text-xs">
                        {visit.views}x
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {visit.time}
                      </div>
                      <span>{visit.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};