export type TaskKind = "align" | "train" | "draft" | "extract";

export type TrainMode = "ot" | "early_nt" | "nt";

export type TaskStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "unknown";

export interface ParatextProject {
  id: string;
  name: string;
  full_name: string;
  iso_code: string;
  lang: string;
  path: string;
  created_at: string; // ISO date-time string
  scripture_filename: string;
  extract_task_id?: string | null;
}

export interface AlignTaskParams {
  target_scripture_file: string;
  experiment_name: string;
  source_scripture_files: string[];
  results?: { [key: string]: string }[];
}

export interface TrainTaskParams {
  project_id: string;
  target_scripture_file: string;
  experiment_name: string;
  source_scripture_files: string[];
  training_corpus?: string;
  lang_codes: Record<string, string>;
  train_mode?: TrainMode;
  related_task_ids?: string[];
  results?: { [key: string]: { [key: string]: string } };
}

export interface TranslateTaskParams {
  experiment_name: string;
  train_task_id: string;
  source_project_id: string;
  book_names: string[];
  source_script_code: string;
  target_script_code: string;
}

export interface ExtractTaskParams {
  project_id: string;
}

export type TaskParams =
  | AlignTaskParams
  | TrainTaskParams
  | TranslateTaskParams
  | ExtractTaskParams;

export interface BaseTask {
  id: string;
  kind: TaskKind;
  status: TaskStatus;
  created_at: string; // ISO date-time string
  started_at?: string | null;
  ended_at?: string | null;
  result?: Record<string, any> | null;
  error?: string | null;
  parameters: TaskParams;
}

export interface AlignTask extends BaseTask {
  kind: "align";
  parameters: AlignTaskParams;
}

export interface TrainTask extends BaseTask {
  kind: "train";
  parameters: TrainTaskParams;
}

export interface TranslateTask extends BaseTask {
  kind: "draft";
  parameters: TranslateTaskParams;
}

export interface ExtractTask extends BaseTask {
  kind: "extract";
  parameters: ExtractTaskParams;
}

export type Task = AlignTask | TrainTask | TranslateTask | ExtractTask;

export interface Scripture {
  id: string;
  name: string;
  lang_code: string;
  path: string;
  stats: {
    details: { [key: string]: number };
    summary: {
      whole_bible: number;
      old_testament: number;
      new_testament: number;
      deuterocanonical: number;
    };
  };
}

export interface Draft {
  project_id: string;
  source_scripture_name: string;
  book_name: string;
  train_experiment_name: string;
  has_pdf: boolean;
}

// Schemas for creating new tasks (request bodies)

export interface AlignTaskCreate {
  project_id: string;
  target_scripture_file: string;
  source_scripture_files: string[];
}

export interface TrainTaskCreate {
  project_id: string;
  source_scripture_files: string[];
  training_corpus: string;
  lang_codes: Record<string, string>;
  train_mode?: TrainMode;
}

export interface DraftTaskCreate {
  experiment_name: string;
  train_task_id: string;
  source_project_id: string;
  book_names: string[];
  source_script_code: string;
  target_script_code: string;
}

export interface ExtractTaskCreate {
  project_id: string;
}

// For API error responses
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}
