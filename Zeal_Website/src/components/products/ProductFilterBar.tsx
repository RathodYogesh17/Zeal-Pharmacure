import React from "react";
import { Search, X, SlidersHorizontal, Layers, Pill, ShieldCheck, RotateCcw, LayoutGrid, List } from "lucide-react";
import { ThemedSelect, type OptionItem, DateRangePicker } from "../common";
import type { ICategory } from "../../types";

export interface ProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  sortOptions: OptionItem[];
  startDate: string;
  endDate: string;
  onDateApply: (start: string, end: string) => void;
  onDateClear: () => void;
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  categoryOptions: OptionItem[];
  selectedDosage: string;
  onDosageChange: (dosage: string) => void;
  dosageOptions: OptionItem[];
  selectedPrescription: string;
  onPrescriptionChange: (rx: string) => void;
  prescriptionOptions: OptionItem[];
  alphabet: string[];
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
  totalResults: number;
  startIndex: number;
  endIndex: number;
  activeFiltersCount: number;
  onClearAll: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  categories: ICategory[];
}

const FilterTag: React.FC<{ label: string; onRemove: () => void; highlight?: boolean }> = ({
  label,
  onRemove,
  highlight = false,
}) => (
  <span className={`zp-pfb-filter-tag${highlight ? " highlight" : ""}`}>
    {label}
    <button type="button" onClick={onRemove} className="zp-pfb-filter-tag-remove">
      <X size={11} />
    </button>
  </span>
);

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions,
  startDate,
  endDate,
  onDateApply,
  onDateClear,
  selectedCategory,
  onCategoryChange,
  categoryOptions,
  selectedDosage,
  onDosageChange,
  dosageOptions,
  selectedPrescription,
  onPrescriptionChange,
  prescriptionOptions,
  alphabet,
  selectedLetter,
  onLetterChange,
  totalResults,
  startIndex,
  endIndex,
  activeFiltersCount,
  onClearAll,
  viewMode,
  onViewModeChange,
  categories,
}) => {
  return (
    <div className="zp-pfb-wrapper">
      {/* Row 1: Search Input */}
      <div className="zp-pfb-search-wrap">
        <div className="zp-pfb-search-inner">
          <Search size={18} className="zp-pfb-search-icon" />
          <input
            type="text"
            placeholder="Search brand name, generic salt, active composition (e.g. Paracetamol, Pantoprazole, Amoxicillin)..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="zp-input"
            style={{ paddingLeft: "46px", paddingRight: searchQuery ? "44px" : "16px" }}
          />
          {searchQuery && (
            <button type="button" onClick={() => onSearchChange("")} className="zp-pfb-clear-btn" title="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Filter Selectors */}
      <div className="zp-pfb-filters-grid">
        <ThemedSelect icon={<SlidersHorizontal size={15} />} value={sortBy} onChange={onSortChange} options={sortOptions} />
        <DateRangePicker startDate={startDate} endDate={endDate} onApply={onDateApply} onClear={onDateClear} />
        <ThemedSelect icon={<Layers size={15} />} value={selectedCategory} onChange={onCategoryChange} options={categoryOptions} />
        <ThemedSelect icon={<Pill size={15} />} value={selectedDosage} onChange={onDosageChange} options={dosageOptions} />
        <ThemedSelect icon={<ShieldCheck size={15} />} value={selectedPrescription} onChange={onPrescriptionChange} options={prescriptionOptions} />
      </div>

      {/* Row 3: A–Z Letter Index */}
      <div className="zp-pfb-alpha-row">
        <span className="zp-pfb-alpha-label">A–Z FILTER:</span>
        <div className="zp-pfb-alpha-list">
          {alphabet.map(letter => (
            <button
              key={letter}
              type="button"
              onClick={() => onLetterChange(letter)}
              className={`zp-pfb-alpha-btn${selectedLetter === letter ? " active" : ""}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Summary & View Toggle */}
      <div className="zp-pfb-bottom-row">
        <div className="zp-pfb-summary">
          <span className="zp-pfb-summary-text">
            Showing <strong style={{ color: "#0F172A" }}>
              {totalResults === 0 ? 0 : `${startIndex}–${endIndex}`}
            </strong> of <strong style={{ color: "var(--zp-primary)" }}>{totalResults}</strong> formulations
          </span>

          <div className="zp-pfb-tags-wrap">
            {selectedCategory !== "ALL" && (
              <FilterTag
                label={`Category: ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
                onRemove={() => onCategoryChange("ALL")}
              />
            )}
            {selectedLetter !== "ALL" && (
              <FilterTag label={`Letter: ${selectedLetter}`} onRemove={() => onLetterChange("ALL")} highlight />
            )}
            {(startDate || endDate) && (
              <FilterTag label={`Date: ${startDate || "Start"} to ${endDate || "Today"}`} onRemove={onDateClear} />
            )}
            {selectedDosage !== "ALL" && (
              <FilterTag label={`Form: ${selectedDosage}`} onRemove={() => onDosageChange("ALL")} />
            )}
            {selectedPrescription !== "ALL" && (
              <FilterTag label={`Type: ${selectedPrescription}`} onRemove={() => onPrescriptionChange("ALL")} />
            )}
            {activeFiltersCount > 0 && (
              <button type="button" onClick={onClearAll} className="zp-pfb-reset-btn">
                <RotateCcw size={11} />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>

        <div className="zp-pfb-view-toggle">
          <div className="zp-pfb-toggle-wrap">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`zp-pfb-view-btn${viewMode === "grid" ? " active" : ""}`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`zp-pfb-view-btn${viewMode === "list" ? " active" : ""}`}
              title="List View"
            >
              <List size={15} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
