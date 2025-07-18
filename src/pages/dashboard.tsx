import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import LabelManager from "@/components/LabelManager";
import { Header } from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allLeads, setAllLeads] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openVisitors, setOpenVisitors] = useState(new Set());
  const [initialVisitorSet, setInitialVisitorSet] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [filterType, setFilterType] = useState("alles");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [minVisits, setMinVisits] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [openLabelMenus, setOpenLabelMenus] = useState({});
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editedLabelName, setEditedLabelName] = useState("");
  const labelMenuContainerRef = useRef(null);
  const labelMenuRef = useRef(null);
  const companyRefs = useRef({});
  const [companySearch, setCompanySearch] = useState("");

  function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  }

  function exportLeadsToCSV(leads) {
    if (!leads || leads.length === 0) {
      alert("Geen leads om te exporteren.");
      return;
    }
    const headers = Object.keys(leads[0]);
    const csvRows = [headers.join(",")];
    for (const lead of leads) {
      const values = headers.map((header) => {
        const val = lead[header];
        return `"${val !== null && val !== undefined ? String(val).replace(/"/g, '""') : ""}"`;
      });
      csvRows.push(values.join(","));
    }
    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "leads_export.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!user || error) {
        router.replace("/login");
        return;
      }
      setUser(user);

      const { data: allData } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .not("company_name", "is", null);
      setAllLeads(allData || []);

      const { data: labelData } = await supabase
        .from("labels")
        .select("*")
        .eq("user_id", user.id);
      setLabels(labelData || []);

      setLoading(false);

      const subscription = supabase
        .channel("public:leads")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "leads" },
          (payload) => {
            if (payload.new.user_id === user.id) {
              setAllLeads((prev) => [payload.new, ...prev]);
            }
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(subscription);
      };
    };
    getData();
  }, [router]);

  const refreshLabels = async () => {
    const { data } = await supabase
      .from("labels")
      .select("*")
      .eq("user_id", user.id);
    setLabels(data || []);
  };

  const handleLogout = () => {
    supabase.auth.signOut().then(() => router.push("/login"));
  };

  const toggleVisitor = (visitorId) => {
    setOpenVisitors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(visitorId)) {
        newSet.delete(visitorId);
      } else {
        newSet.add(visitorId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedCompany = Object.values(companyRefs.current).some((ref) =>
        ref?.contains(event.target)
      );
      const clickedLabel = labelMenuRef.current?.contains(event.target);
      if (!clickedCompany && !clickedLabel) {
        setOpenLabelMenus({});
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isInDateRange = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (filterType) {
      case "vandaag":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return date >= today && date < tomorrow;
      case "gisteren":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return date >= yesterday && date < today;
      case "deze-week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return date >= weekStart && date < weekEnd;
      case "vorige-week":
        const prevWeekStart = new Date(today);
        prevWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const prevWeekEnd = new Date(prevWeekStart);
        prevWeekEnd.setDate(prevWeekStart.getDate() + 7);
        return date >= prevWeekStart && date < prevWeekEnd;
      case "vorige-maand":
        const firstThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return date >= firstPrevMonth && date < firstThisMonth;
      case "dit-jaar":
        const janFirst = new Date(today.getFullYear(), 0, 1);
        const nextYear = new Date(today.getFullYear() + 1, 0, 1);
        return date >= janFirst && date < nextYear;
      case "aangepast":
        if (customRange.from && customRange.to) {
          const from = new Date(customRange.from);
          const to = new Date(customRange.to);
          to.setDate(to.getDate() + 1);
          return date >= from && date < to;
        }
        return true;
      default:
        return true;
    }
  };

  const filteredLeads = allLeads.filter((l) => {
    if (!isInDateRange(l.timestamp)) return false;
    if (locationSearch && !l.location?.toLowerCase().includes(locationSearch.toLowerCase())) return false;
    if (pageSearch && !l.page_url?.toLowerCase().includes(pageSearch.toLowerCase())) return false;
    if (minDuration && (!l.duration_seconds || l.duration_seconds < +minDuration)) return false;
    if (labelFilter) {
      const hasLabel = labels.some(
        (lab) => lab.company_name === l.company_name && lab.label === labelFilter
      );
      if (!hasLabel) return false;
    }
    return true;
  });

  const allCompanies = [...new Map(allLeads.map((lead) => [lead.company_name, lead])).values()];
  const groupedCompanies = filteredLeads.reduce((acc, lead) => {
    acc[lead.company_name] = acc[lead.company_name] || [];
    acc[lead.company_name].push(lead);
    return acc;
  }, {});
  const activeCompanyNames = Object.keys(groupedCompanies).filter((name) =>
    minVisits ? groupedCompanies[name].length >= +minVisits : true
  );
  const companies = allCompanies.filter((c) => activeCompanyNames.includes(c.company_name));
  const selectedCompanyData = selectedCompany
    ? allCompanies.find((c) => c.company_name === selectedCompany)
    : null;
  const filteredActivities = filteredLeads.filter((l) => l.company_name === selectedCompany);
  const groupedByVisitor = filteredActivities.reduce((acc, activity) => {
    const key = activity.anon_id || `onbekend-${activity.id}`;
    acc[key] = acc[key] || [];
    acc[key].push(activity);
    return acc;
  }, {});
  const sortedVisitors = Object.entries(groupedByVisitor).sort(
    ([, a], [, b]) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent"></div>
      </div>
    );
  }

  return (
  <>
    <Header
      user={user}
      onLogout={handleLogout}
      onExport={() => exportLeadsToCSV(filteredLeads)}
    />
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters */}
       
        <Card className="space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>

          <Select
            value={filterType}
            onValueChange={(val) => {
              setFilterType(val);
              setSelectedCompany(null);
              setInitialVisitorSet(false);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecteer een filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alles">Alles</SelectItem>
              <SelectItem value="vandaag">Vandaag</SelectItem>
              <SelectItem value="gisteren">Gisteren</SelectItem>
              <SelectItem value="deze-week">Deze week</SelectItem>
              <SelectItem value="vorige-week">Vorige week</SelectItem>
              <SelectItem value="vorige-maand">Vorige maand</SelectItem>
              <SelectItem value="dit-jaar">Dit jaar</SelectItem>
              <SelectItem value="aangepast">Aangepast</SelectItem>
            </SelectContent>
          </Select>

          {filterType === "aangepast" && (
            <div className="space-y-2">
              <Input
                type="date"
                value={customRange.from}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, from: e.target.value }))
                }
              />
              <Input
                type="date"
                value={customRange.to}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
          )}

          <Select
  value={labelFilter || "__all__"}
  onValueChange={(val) => setLabelFilter(val === "__all__" ? "" : val)}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Filter op label" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__all__">Alle labels</SelectItem>
    {Array.from(new Set(labels.map((l) => l.label))).map((label) => (
      <SelectItem key={label} value={label}>
        {label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


          <Input
            placeholder="Zoek bedrijfsnaam"
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
          />
          <Input
            placeholder="Zoek land/stad"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Minimaal bezoeken"
            value={minVisits}
            onChange={(e) => setMinVisits(e.target.value)}
          />
          <Input
            placeholder="Zoek pagina"
            value={pageSearch}
            onChange={(e) => setPageSearch(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Minimale duur (s)"
            value={minDuration}
            onChange={(e) => setMinDuration(e.target.value)}
          />
        </Card>

        {/* Bedrijvenlijst */}
        <Card
          ref={labelMenuContainerRef}
          className="space-y-2 md:col-span-3"
        >
          <h2 className="text-lg font-semibold text-gray-800">Bedrijven</h2>
          {companies.length === 0 && (
            <p className="text-sm text-gray-500">
              Geen bezoekers binnen dit filter.
            </p>
          )}
          {companies
            .filter(
              (c) =>
                c.company_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) &&
                c.company_name
                  .toLowerCase()
                  .includes(companySearch.toLowerCase())
            )
            .map((company) => (
              <div
                key={company.company_name}
                ref={(el) =>
                  (companyRefs.current[company.company_name] = el)
                }
                onClick={() => {
                  setSelectedCompany(company.company_name);
                  setInitialVisitorSet(false);
                }}
                className={`cursor-pointer flex flex-col gap-1 px-3 py-2 rounded ${
                  selectedCompany === company.company_name
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex gap-2">
                  {company.company_domain && (
                    <img
                      src={`https://img.logo.dev/${company.company_domain}?token=pk_R_r8ley_R_C7tprVCpFASQ`}
                      alt="logo"
                      className="w-5 h-5 object-contain rounded-sm"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  )}
                  <div className="flex flex-col">
                    <span>{company.company_name}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {labels
                        .filter(
                          (l) =>
                            l.company_name === company.company_name
                        )
                        .map((label) => (
                          <span
                            key={label.id}
                            style={{ backgroundColor: label.color }}
                            className="flex items-center gap-1 text-xs text-gray-700 px-2 py-0.5 rounded"
                          >
                            {label.label}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await supabase
                                  .from("labels")
                                  .delete()
                                  .eq("id", label.id);
                                refreshLabels();
                              }}
                              className="hover:text-red-600"
                              title="Verwijderen"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Card>

        {/* Activiteiten */}
        <div className="space-y-4 md:col-span-7">
          {selectedCompany ? (
            <Card>
              {selectedCompanyData && (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    {selectedCompanyData.company_domain && (
                      <img
                        src={`https://img.logo.dev/${selectedCompanyData.company_domain}?token=pk_R_r8ley_R_C7tprVCpFASQ`}
                        alt="logo"
                        className="w-8 h-8 object-contain rounded border"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-800">
                        {selectedCompanyData.company_name}
                      </div>
                      {selectedCompanyData.linkedin_url && (
                        <a
                          href={selectedCompanyData.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          LinkedIn-profiel
                        </a>
                      )}
                      {selectedCompanyData.kvk_number && (
                        <div className="text-xs text-gray-500">
                          KVK: {selectedCompanyData.kvk_number}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Activiteiten – {selectedCompany}
              </h2>

              {sortedVisitors.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Geen activiteiten gevonden.
                </p>
              ) : (
                sortedVisitors.map(([visitorId, sessions], index) => {
                  const isOpen = openVisitors.has(visitorId);
                  return (
                    <div
                      key={visitorId}
                      className="rounded-lg border bg-gray-50 p-4 mb-4 shadow-sm"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => toggleVisitor(visitorId)}
                        className="flex justify-between w-full text-left font-medium text-sm"
                      >
                        Bezoeker {index + 1}
                        <span>{isOpen ? "▲" : "▼"}</span>
                      </Button>
                      {isOpen && (
                        <div className="mt-3">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Pagina</TableHead>
                                <TableHead>Tijdstip</TableHead>
                                <TableHead>Duur (s)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sessions.map((s) => (
                                <TableRow key={s.id}>
                                  <TableCell>{s.page_url}</TableCell>
                                  <TableCell>
                                    {new Date(
                                      s.timestamp
                                    ).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    {s.duration_seconds ?? "-"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </Card>
          ) : (
            <div className="bg-white border p-4 rounded text-gray-500">
              Selecteer een bedrijf om activiteiten te bekijken.
            </div>
          )}
        </div>
      </div>
        </div>
  </>
);
}

