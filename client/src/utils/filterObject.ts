import { FilterState } from "../components/Filter/FilterChips";

/**
 * Filter an array of objects with an array of filter objects.
 * @param data array of objects to be filtered
 * @param filters key value pairs to used to filter the data
 * @returns array with objects that meet the criteria of the filter objects, if no filters, returns data
 *
 * @example <caption>return all "Upper Body" workouts?</caption>
 * const data = [{name: "Bench Press", type: "Upper Body"}]
 * filterData(data, {type: "Upper Body"})
 */
export function filterData(data: any[] | [], filters: FilterState) {
  var filterObjArray = Object.entries(filters);

  filterObjArray.forEach((filter) => {
    if (Array.isArray(data) && data.length === 0) {
      return data;
    }
    var [filterKey, filterValue] = filter;
    var filterIsArray: boolean =
      Array.isArray(filterValue) && filterValue.length > 0;
    var filterIsString: boolean =
      typeof filterValue === "string" && filterValue.length > 0;

    if (filterIsArray) {
      data = data.filter((obj: any) => {
        if (Array.isArray(obj[filterKey])) {
          // Array filtered by array, returns obj if contains any filter values
          if (
            obj[filterKey].some((value: string) => filterValue.includes(value))
          ) {
            return obj;
          }
        } else {
          // Text value filtered by array
          if (filterValue.includes(obj[filterKey])) {
            return obj;
          }
        }
      });
    } else if (filterIsString) {
      data = data.filter((obj: any) => {
        if (Array.isArray(obj[filterKey])) {
          // Array filterd by string value
          if (obj[filterKey].includes(filterValue)) {
            return obj;
          }
        } else {
          // String value filtered by string value
          if (obj[filterKey] === filterValue) {
            return obj;
          }
        }
      });
    }
  });
  return data;
}




