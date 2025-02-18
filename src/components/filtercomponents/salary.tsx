import { ChevronDown, ChevronUp, Clock, Briefcase, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { JobCard } from "./jobcard";


export function Jobs() {
  const [selectedSalaries, setSelectedSalaries] = useState<SalaryRange[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobTypeRange[]>([]);
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const [experience, setExperience] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [alljob, setAlljob] = useState<Jobtypeprop[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Jobtypeprop[]>([]);

  const salaryRanges: SalaryRange[] = [
    { label: "0 - 3 Lakh", min: 0, max: 3 },
    { label: "3 - 6 Lakh", min: 3, max: 6 },
    { label: "6 - 10 Lakh", min: 6, max: 10 },
    { label: "10 - 15 Lakh", min: 10, max: 15 },
  ];

  const jobTypeRanges: JobTypeRange[] = [
    { label: "Full-Time" },
    { label: "Part-Time" },
    { label: "Contract" },
    { label: "Freelance" },
  ];

  async function refreshjobs() {
    try {
      const res = await fetch("/api/jobstream", {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application",
        },
      });
      const json = await res.json();

      console.log("API Response:", json.job); // Debugging log

      if (Array.isArray(json.job)) {
        setAlljob(json.job);
      } else {
        setAlljob([]); // Ensure it's always an array
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    refreshjobs();
  }, []);
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExperience(Number(e.target.value));
  };

  const formatExperience = (value: number) => {
    return value === 12 ? "12+" : value.toString();
  };

  const toggleJobType = (jobType: JobTypeRange) => {
    setSelectedJobTypes((prev) =>
      prev.some(t => t.label === jobType.label)
        ? prev.filter((t) => t.label !== jobType.label)
        : [...prev, jobType]
    );
  };

  const toggleSalary = (range: SalaryRange) => {
    setSelectedSalaries((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  useEffect(() => {
    let filtered = alljob;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply salary filter
    if (selectedSalaries.length > 0) {
      filtered = filtered.filter((job) =>
        selectedSalaries.some(
          (range) => job.salary >= range.min && job.salary <= range.max
        )
      );
    }

    // Apply job type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) =>
        selectedJobTypes.some((type) => job.jobtype === type.label)
      );
    }

    // Apply experience filter
    if (experience > 0) {
      filtered = filtered.filter((job) => job.experience <= experience);
    }

    setFilteredJobs(filtered);
  }, [selectedJobTypes, selectedSalaries, experience, search]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Salary Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSalaryOpen((prev) => !prev)}
                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-lg shadow-sm flex items-center justify-between text-gray-700 hover:border-emerald-300 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span>
                    {selectedSalaries.length
                      ? `${selectedSalaries.length} Salary Range${
                          selectedSalaries.length > 1 ? "s" : ""
                        }`
                      : "Salary Range"}
                  </span>
                </div>
                {isSalaryOpen ? (
                  <ChevronUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-emerald-600" />
                )}
              </button>

              {isSalaryOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-emerald-100 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    {salaryRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-emerald-50 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSalaries.includes(range)}
                          onChange={() => toggleSalary(range)}
                          className="w-4 h-4 border-2 border-emerald-300 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Job Type Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsJobTypeOpen(!isJobTypeOpen)}
                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-lg shadow-sm flex items-center justify-between text-gray-700 hover:border-emerald-300 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span>
                    {selectedJobTypes.length
                      ? `${selectedJobTypes.length} Job Type${
                          selectedJobTypes.length > 1 ? "s" : ""
                        }`
                      : "Job Type"}
                  </span>
                </div>
                {isJobTypeOpen ? (
                  <ChevronUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-emerald-600" />
                )}
              </button>

              {isJobTypeOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-emerald-100 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    {jobTypeRanges.map((jobType) => (
                      <label
                        key={jobType.label}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-emerald-50 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedJobTypes.some(t => t.label === jobType.label)}
                          onChange={() => toggleJobType(jobType)}
                          className="w-4 h-4 border-2 border-emerald-300 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{jobType.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Filter */}
            <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">Experience (Years)</span>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    value={experience}
                    onChange={handleExperienceChange}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />

                  <div className="flex justify-between px-1 mt-2">
                    {[...Array(13)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-0.5 h-1 bg-emerald-200"></div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between px-1 mt-1">
                    <span className="text-xs text-gray-500">0</span>
                    <span className="text-xs text-gray-500">12+</span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="bg-emerald-50 px-4 py-2 rounded-full">
                    <span className="text-sm text-emerald-700 font-medium">
                      {formatExperience(experience)}{" "}
                      {experience === 0 ? "Year" : "Years"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="ml-4">  
                    {Array.isArray(filteredJobs) && filteredJobs.length > 0 ? (  
                      filteredJobs.map((job) => (  
                        <div key={job.id || job.title}>  
                          <JobCard userjob={job} />  
                        </div>  
                      ))  
                    ) : (  
                      <div className="text-gray-500 mt-4">No jobs found.</div>  
                    )}  
                  </div>  
        </div>
      </div>
    </div>
  );
}