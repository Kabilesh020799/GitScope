import { useMemo, useState } from "react";

export const useContributorFilter = (commits) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const contributorList = useMemo(
    () =>
      Array.from(
        new Set(commits.map((c) => c?.commit?.author?.name).filter(Boolean))
      ),
    [commits]
  );

  const filteredContributors = useMemo(
    () =>
      contributorList.filter(
        (name) =>
          name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedContributors.includes(name)
      ),
    [contributorList, searchQuery, selectedContributors]
  );

  const filteredCommits = useMemo(() => {
    if (!selectedContributors.length) return commits;
    return commits.filter((c) =>
      selectedContributors.includes(c?.commit?.author?.name)
    );
  }, [commits, selectedContributors]);

  const handleContributorSelect = (name) => {
    if (!selectedContributors.includes(name)) {
      setSelectedContributors((prev) => [...prev, name]);
      setSearchQuery("");
      setDropdownOpen(false);
    }
  };

  const handleRemoveChip = (name) => {
    setSelectedContributors((prev) => prev.filter((n) => n !== name));
  };

  return {
    searchQuery,
    setSearchQuery,
    dropdownOpen,
    setDropdownOpen,
    selectedContributors,
    filteredContributors,
    filteredCommits,
    handleContributorSelect,
    handleRemoveChip,
  };
};
