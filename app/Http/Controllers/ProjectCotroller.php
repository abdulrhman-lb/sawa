<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectCotroller extends Controller
{
  public function index()
  {
    $query = Project::query();

    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search
    if (request("status")) {
      $query->where("status", request("status"));
    }
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }

    // Apply
    $projects = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
    return inertia("Project/Index", [
      "projects"    => ProjectResource::collection($projects),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    return inertia("Project/Create");
  }

  public function store(StoreProjectRequest $request)
  {
    $data = $request->validated();
    /** @var image Illuminate\Http\UploadedFile */
    $image = $data['image'] ?? null;
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();
    if ($image) {
      $data['image_path'] = $image->store('project/' . Str::random(), 'public');
    };
    Project::create($data);
    return to_route('project.index')->with('success', 'Project was created');
  }

  public function show(Project $project)
  {
    $query = $project->tasks();
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

    $tasks = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
    return inertia("Project/Show", [
      'project'     => new ProjectResource($project),
      'tasks'       => TaskResource::collection($tasks),
      'queryParams' => request()->query() ?: null,
    ]);
  }

  public function edit(Project $project)
  {
    return inertia("Project/Edit", [
      'project' => new ProjectResource($project)
    ]);
  }

  public function update(UpdateProjectRequest $request, Project $project)
  {
    $data = $request->validated();
    $image = $data['image'] ?? null;
    $data['updated_by'] = Auth::id();
    if ($image) {
      if ($project->image_path) {
        Storage::disk('public')->deleteDirectory(dirname($project->image_path));
      }
      $data['image_path'] = $image->store('project/' . Str::random(), 'public');
    };
    $project->update($data);
    return to_route('project.index')->with('success', "Project \"$project->name\" was updated");
  }

  public function destroy(Project $project)
  {
    $name = $project->name;
    $project->delete();
    if ($project->image_path) {
      Storage::disk('public')->deleteDirectory(dirname($project->image_path));
    }
    return to_route('project.index')->with('success', "Project \"$name\" was deleted");
  }
}
