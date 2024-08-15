import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { Link, router } from "@inertiajs/react";

export default function TasksTable({ tasks, queryParams = null, hideProjectColumn = false, success }) {
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    router.get(route('task.index'), queryParams)
  }

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged('name', e.target.value);
  }

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === 'asc') {
        queryParams.sort_direction = 'desc';
      } else {
        queryParams.sort_direction = 'asc';
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    router.get(route('task.index'), queryParams)
  }

  const deleteTask = (task) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    router.delete(route('task.destroy', task.id))
  }
  return (
    <>
      {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
        {success}
      </div>)}
      <div className="overflow-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              <TableHeading
                name='id'
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>
              <TableHeading
                name='image'
                sortable={false}
              >
                Image
              </TableHeading>
              {!hideProjectColumn && <TableHeading
                name='project.name'
                sortable={false}
              >
                Project Name
              </TableHeading>}
              <TableHeading
                name='name'
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Name
              </TableHeading>
              <TableHeading
                name='status'
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Status
              </TableHeading>
              <TableHeading
                name='priority'
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Priority
              </TableHeading>
              <TableHeading
                name='created_at'
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Create Date
              </TableHeading>
              <TableHeading
                name='due_date'
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Due Date
              </TableHeading>
              <TableHeading
                sortable={false}
              >
                Created By
              </TableHeading>

              <TableHeading
                sortable={false}
              >
                Actions
              </TableHeading>
            </tr>
          </thead>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              {!hideProjectColumn && <th className="px-3 py-3"></th>}
              <th className="px-3 py-3">
                <TextInput
                  className="w-full"
                  defaultValue={queryParams.name}
                  placeholder="Task Name"
                  onBlur={e => searchFieldChanged('name', e.target.value)}
                  onKeyPress={e => onKeyPress('name', e)}
                >
                </TextInput>
              </th>
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full"
                  defaultValue={queryParams.status}
                  onChange={e => searchFieldChanged('status', e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>
              </th>
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full"
                  defaultValue={queryParams.priority}
                  onChange={e => searchFieldChanged('priority', e.target.value)}
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </SelectInput>
              </th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                <td className="px-3 py-2">{task.id}</td>
                <td className="px-3 py-2"><img src={task.image_path} className=" rounded-sm" style={{ width: 60 }} /></td>
                {!hideProjectColumn && <td className="px-3 py-2">{task.project.name}</td>}
                <th className="px-3 py-2 hover:underline text-gray-100 text-nowrap">
                  <Link href={route("task.show", task.id)}>
                    {task.name}
                  </Link>
                </th>
                <td className="px-3 py-2">
                  <span className="px-2 py-1 cursor-pointer rounded text-white text-nowrap ">
                    
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-1 cursor-pointer rounded text-white text-nowrap "  >
                    
                  </span>
                </td>
                <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
                <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                <td className="px-3 py-2">{task.createdBy.name}</td>
                <td className="px-3 py-2 text-nowrap">
                  <Link href={route("task.edit", task.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                    Edit
                  </Link>
                  <button
                    onClick={e => deleteTask(task)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination links={tasks.meta.links} />
    </>
  )
}
