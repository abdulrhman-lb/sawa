import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

export default function TableHeading({
  name,
  sort_field = null,
  sort_direction = null,
  sortable = true,
  children,
  sortChanged = () => { }
}) {
  return (
    <th onClick={(e) => sortChanged(name)} className="text-center">
      <div className="text-md px-3 py-3 flex items-center justify-center gap-1 cursor-pointer">
        {sortable &&
          <div className="flex flex-col items-center">
            <ChevronUpIcon className={
              "w-4 " +
              (sort_field === name && sort_direction === 'asc' ? 'text-white' : '')
            } />
            <ChevronDownIcon className={
              "w-4 " +
              (sort_field === name && sort_direction === 'desc' ? 'text-white' : '')
            } />
          </div>}
        {children}

      </div>
    </th>
  )
}
