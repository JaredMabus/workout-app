import React, { useEffect, SetStateAction } from "react";
import { Chip, Stack, Typography, Box, Divider } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {
  MuscleCategoryType,
  MuscleGroupType,
  WorkoutMethodType,
} from "../../Redux/slices/workoutSlice";

export interface ChipInputProps {
  filter: string;
  filterKey: FilterKey;
  filters: FilterState;
  handleFilterChange: Function;
}

const ChipInput = ({
  filter,
  filterKey,
  filters,
  handleFilterChange,
}: ChipInputProps) => {
  /** Update chip display  */
  const checkActiveFilters = () => {
    if (Object.values(filters[filterKey]).includes(filter)) {
      return true;
    } else if (filters[filterKey] === filter) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    checkActiveFilters();
  }, [filters]);

  const disabledArray: string[] = [];
  return (
    <Chip
      key={`${filter}-${filterKey}-chip`}
      color={checkActiveFilters() ? "secondary" : "primary"}
      variant={checkActiveFilters() ? "filled" : "outlined"}
      sx={{
        m: 0.5,
        border: "1px solid lightgrey",
      }}
      label={filter}
      onClick={() => handleFilterChange(filter, filterKey)}
      disabled={disabledArray.includes(filter)}
    />
  );
};

/**
 * An object that contains the key value pairs used to filter the data.
 * @param key used to find/match the desired object's key.
 * @param value a string or array used to filter the data.
 */
export interface FilterState {
  muscleCategory: Partial<MuscleCategoryType>[] | [] | MuscleCategoryType;
  muscleGroup: Partial<MuscleGroupType>[] | [] | MuscleGroupType;
  methodSelection: Partial<WorkoutMethodType>[] | [] | WorkoutMethodType;
}

export type FilterKey = keyof FilterState;

export type RequiredFilterKey<T> = {
  [K in keyof Partial<T>]: string[] | [];
};

/**
 * Options for setting the filter state object.
 * @param filterObj the filter key value pair used to filter the data. Value is either string or array.
 * @param filterByString converts filter output to string.
 * Allowing for one active filter option at a time.
 * @param title title displayed for the filter chip group
 */
export interface FilterOptions {
  methods?: Partial<WorkoutMethodType>[] | [];
  muscleCategory?: Partial<MuscleCategoryType>[] | [];
  muscleGroup?: Partial<MuscleGroupType>[] | [];
  filterByString: boolean;
  title: string;
}

interface FilterChipProps {
  filters: FilterState;
  setFilterState: React.Dispatch<SetStateAction<FilterState>>;
  filterOptions: FilterOptions[];
}

export default function FilterChips({
  filters,
  setFilterState,
  filterOptions,
}: FilterChipProps) {
  const handleFilterChange = (
    filter: string,
    filterKey: FilterKey,
    filterByString: boolean = false
  ) => {
    // Filter by string. Add filter
    if (filterByString && filter !== "All" && filters[filterKey] !== filter) {
      setFilterState({
        ...filters,
        [filterKey]: filter,
      });
      return;
      // Filter by string. Remove filter
    } else if (
      (filterByString && filter === "All") ||
      filters[filterKey] === filter
    ) {
      setFilterState({
        ...filters,
        [filterKey]: "",
      });
      return;
    } else if (!filterByString) {
      // Filter by array
      setFilterState({
        ...filters,
        [filterKey]: filterByArray(filter, filterKey),
      });
    }
  };

  /** Handles filter array conditions.
   * @return if filter value is "All", return [], else update or remove filter array value
   */
  const filterByArray = (filter: string, filterKey: FilterKey) => {
    if (filter === "All") {
      return [];
    }
    // Add filter value to filter array
    if (!filters[filterKey].includes(filter as never)) {
      // @ts-ignore
      let newFilterState = [...filters[filterKey], filter];
      return newFilterState;
      // Remove filter value from filter array
    } else {
      // @ts-expect-error:
      let newFilterState = filters[filterKey].filter(
        (i: string) => i !== filter
      );
      return newFilterState;
    }
  };

  return (
    <>
      <Stack divider={<Divider />} spacing={1}>
        <Typography variant="h6">Filters:</Typography>
        {filterOptions.map((item: FilterOptions, key: number) => (
          <Box key={`${item.title}-${key}-chip-group`}>
            <Typography
              key={`${item.title}-${key}-chip-title`}
              variant="subtitle1"
            >
              {item.title}
            </Typography>
            <Stack
              key={`${item.title}-${key}-chip-stack`}
              direction="row"
              sx={{
                justifyContent: "start",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                minWidth: 300,
                my: 0.3,
              }}
            >
              {Object.values(item)[0].map((filter: string, index: number) => {
                return (
                  <ChipInput
                    key={`${Object.keys(item)[0]}-${index}-chip-input-wrapper`}
                    filter={filter}
                    filterKey={Object.keys(item)[0] as FilterKey}
                    filters={filters}
                    handleFilterChange={() =>
                      handleFilterChange(
                        filter,
                        Object.keys(item)[0] as FilterKey,
                        item.filterByString
                      )
                    }
                  />
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );
}
