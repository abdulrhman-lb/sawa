<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class TaskCotroller extends Controller
{
    public function index()
    {
      $query = Task::query();

      // Sorting
      $sortField = request('sort_field', 'id');
      $sortDirection = request('sort_direction', 'asc');
  
      // Search
      if (request("status")) {
        $query->where("status", request("status"));
      }
      if (request("name")) {
        $query->where("name", "like", "%" . request("name") . "%");
      }
      if (request("priority")) {
        $query->where("priority", request("priority"));
      }

      // Apply
      $tasks = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
      return inertia("Task/Index", [
        "tasks" => TaskResource::collection($tasks),
        'queryParams' => request()->query() ?: null,
        'success'     => session('success'),
      ]);
    }

    public function create()
    {
      $users = User::query()->orderBy('name')->get();
      $projects = Project::query()->orderBy('name')->get();
      return inertia("Task/Create" ,[
        'users'     => UserResource::collection($users),
        'projects'  => ProjectResource::collection($projects)
      ]);
    }

    public function store(StoreTaskRequest $request)
    {
      $data = $request->validated();
      /** @var image Illuminate\Http\UploadedFile */
      $image = $data['image'] ?? null;
      $data['created_by'] = Auth::id();
      $data['updated_by'] = Auth::id();
      if ($image) {
        $data['image_path'] = $image->store('task/' . Str::random(), 'public');
      };
      Task::create($data);
      return to_route('task.index')->with('success', 'Task was created');
    }

    public function show(Task $task)
    {
      return inertia("Task/Show", [
        'task'=> new TaskResource($task),
      ]);
    }

    public function edit(Task $task)
    {
      $users = User::query()->orderBy('name')->get();
      $projects = Project::query()->orderBy('name')->get();
      return inertia("Task/Edit", [
        'task' => new TaskResource($task),
        'users'     => UserResource::collection($users),
        'projects'  => ProjectResource::collection($projects)
      ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
      $data = $request->validated();
      $image = $data['image'] ?? null;
      $data['updated_by'] = Auth::id();
      if ($image) {
        if ($task->image_path) {
          Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        $data['image_path'] = $image->store('task/' . Str::random(), 'public');
      };
      $task->update($data);
      return to_route('task.index')->with('success', "Task \"$task->name\" was updated");
    }

    public function destroy(Task $task)
    {
      $name = $task->name;
      $task->delete();
      if ($task->image_path) {
        Storage::disk('public')->deleteDirectory(dirname($task->image_path));
      }
      return to_route('task.index')->with('success', "Task \"$name\" was deleted");
    }

    public function myTasks()
    {
      $user = Auth()->user();
      $query = Task::query()->where('assigned_user_id', $user->id);

      // Sorting
      $sortField = request('sort_field', 'id');
      $sortDirection = request('sort_direction', 'asc');
  
      // Search
      if (request("status")) {
        $query->where("status", request("status"));
      }
      if (request("name")) {
        $query->where("name", "like", "%" . request("name") . "%");
      }
      if (request("priority")) {
        $query->where("priority", request("priority"));
      }

      // Apply
      $tasks = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
      return inertia("Task/Index", [
        "tasks" => TaskResource::collection($tasks),
        'queryParams' => request()->query() ?: null,
        'success'     => session('success'),
      ]);

    }
}
