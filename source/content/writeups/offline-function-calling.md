---
title: Offline Function Calling
description:
  Extending and benchmarking function calling in the Gemma 3 model
  family, a Google Summer of Code 2025 project with Google DeepMind.
---

## Background

This project was started as part of my
[Google Summer of Code 2025 project with Google DeepMind](https://summerofcode.withgoogle.com/programs/2025/projects/rexKK7eu).
The primary goal was to explore, extend, and document the function
calling capabilities of the Gemma model family, This effort included
benchmarking and writing tutorials and cookbooks for developers working
with offline models like Gemma 3.

Over 12 weeks, the project progressed from
[simple initial experiments](https://github.com/gamemaker1/gemma3-function-calling-experiments)
to creating a
[comprehensive benchmarking suite](https://github.com/offline-function-calling/benchmarks),
to the development of a
[function calling SDK](https://github.com/offline-function-calling/sdk)
and a
[command-line interface](https://github.com/offline-function-calling/cli)
not unlike the Gemini CLI. This effort included writing and refining
[tutorials](https://github.com/offline-function-calling/sdk/tree/main/docs/learn),
designing and running
[benchmarks](https://github.com/offline-function-calling/benchmarks),
and ongoing efforts to support function calling via the Ollama API in
Gemma 3. The goal was to push the boundaries of function calling with
offline, open-source models like Gemma 3, and create tools and resources
to help developers get started with it.

---

## Contributions

### Implementing Function Calling in Gemma 3

A framework for function calling was designed and implemented for the
Gemma 3 family of models. The framework consists of 5 key parts -
instruction, discovery, calling, parsing, and execution - each of which
is explained in detail in the
[introductory tutorial.](https://offline-function-calling.github.io/learn/hello-world)
The framework's design evolved significantly over the course of the
project. Two key architectural innovations emerged, detailed in the
[second tutorial](https://offline-function-calling.github.io/learn/structuring-and-scaling/):

- Adoption of a
  [schema based approach](https://offline-function-calling.github.io/schemas/function.schema.json)
  to function discovery, with extensions to the OpenAPI-like schema that
  included all possible responses and errors that a function could
  return.
- Playing to the model's strength and using markdown code blocks to wrap
  the function specifications and calls, which helped Gemma models
  produce syntactically valid JSON function calls, with unique
  identifiers. This enables reliable asynchronous execution and accurate
  pairing of calls with their outputs even when models generate multiple
  function calls in parallel.

The framework was progressively extended to support increasingly
sophisticated use cases.
[Multimodal input support](https://offline-function-calling.github.io/learn/multimodal-input/)
was experimented with and proved to succesfully handle complex scenarios
like extracting expense parameters from receipt images, demonstrating
practical applications where structured data extraction from visual
inputs drives function execution. The
[dynamic function generation](https://offline-function-calling.github.io/learn/dynamic-function-generation/)
capability enabled models to write, register, and execute their own code
within a secure
[microsandbox](https://github.com/microsandbox/microsandbox) environment
when existing functions do not meet the needs of the user.

Efforts were also devoted to exploring and pushing the limits of
different Gemma model sizes and quantizations. While larger models (with
12B and 27B parameters) handled complex multi-turn conversations and
large function sets effectively, smaller models (1B and 4B) showed rapid
degradation in performance beyond 3-4 function calls. Investigations
into Gemma 3n models for audio processing revealed challenges with the
models' ability to simultaneously process large function specification
texts and audio instructions, as documented in a
[minimal reproduction](https://gist.github.com/gamemaker1/341ca024645c1c95e846cf85a9aaffd1).
These findings informed the development of model-specific prompting
strategies and highlighted areas for future fine-tuning work.

### Benchmarks and Leaderboard

To objectively measure and compare function calling capabilities across
different models, a
[comprehensive benchmark suite](https://github.com/offline-function-calling/benchmarks)
was developed. The creation process involved research into existing
evaluation methodologies and benchmarks, such as the
[Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html),
and building on them. This leaderboard builds on the Berkeley Function
Calling Leaderboard (BFCL) by expanding its test categories to include
error handling, constraint enforcement, and function synthesis. The
suite's
[methodology](https://offline-function-calling.github.io/bench/methodology/)
systematically evaluates models against 15 distinct parameters including
parameter transformation, error handling, composite calling, parallel
execution, and more, across 10 scenarios. It also evaluates the models
with prompts and settings that enable it to do its best, rather than
using a default prompt, and also test the ability of the model to use
the tools effectively in conversation, rather than just testing its
ability to produce accurate function calls.

Test execution is fully automated using
[Promptfoo](https://github.com/promptfoo/promptfoo) as the test runner,
with [Ollama](https://github.com/ollama/ollama) serving as the model
provider for local execution. LLM-based graders such as Gemini 2.5 Flash
were also used for evaluation where the intent or non-deterministic
output of the model was to be tested.

A
[custom analysis script](https://github.com/offline-function-calling/benchmarks/blob/main/scripts/report.js)
processes raw test results, normalizes scores across different
parameters, and generates a
[leaderboard](https://offline-function-calling.github.io/bench/leaderboard/)
comparing the function calling abilities of 25 different Gemma model
variants and quantizations. The leaderboard presents detailed breakdowns
including normalized scores for each of the 15 parameters tested,
average latency measurements, and qualitative feedback from LLM graders
for each scenario. This revealed insights about how different parameter
counts and quantizations affected function calling capabilities - higher
parameter count models (12B and 27B) substantially outperform smaller
variants (1B and 4B) in function calling tasks, while QAT models
generally demonstrate slightly better instruction following than their
quantized counterparts.

The scoring methodology underwent significant refinement to improve
accuracy and granularity. Initially, parameter scores were assigned
based on overall scenario performance, leading to coarse grained
evaluation where a model failing one aspect of a multi-parameter
scenario would receive poor scores across all tested parameters. The
system was
[enhanced to associate each test case directly with specific parameters](https://github.com/offline-function-calling/benchmarks/commit/09361bf3bcd43bf2757f15231379bfe9d7ab017e),
enabling fine-grained analysis of exactly where models succeed or fail
in the function calling process.

### Writing Tutorials and Documentation

Creating comprehensive, accessible documentation was a primary goal of
the project to make offline function calling easy to get started with.
The documentation process evolved from
[Jupyter notebook tutorials and cookbooks](https://github.com/gamemaker1/gemma3-function-calling-tutorial)
into an educational resource that first establishes basic concepts and
then
[guides developers through a basic implementation](https://offline-function-calling.github.io/learn/hello-world/)
of function calling. This is followed by guides on
[how to extend the implementation to be structured and scalable](https://offline-function-calling.github.io/learn/structuring-and-scaling/),
[how to support multimodal input](https://offline-function-calling.github.io/learn/multimodal-input/),
and
[how to enable dynamic function generation](https://offline-function-calling.github.io/learn/dynamic-function-generation/).
The multimodal tutorial demonstrates practical applications like
building an expense tracker that can process receipt images, while the
dynamic function generation guide shows how models can write and execute
functions on their own within secure, sandboxed environments.

The documentation also includes guides on
[how to setup and use common tools](https://offline-function-calling.github.io/setup/models)
such as Python, Ollama, and Microsandbox, as well as the
[Offline Function Calling CLI](https://offline-function-calling.github.io/setup/cli).

### Creating a SDK and CLI

To make it easier to get started with using the models and framework
outlined in the tutorials, the
[Offline Function Calling SDK](https://github.com/offline-function-calling/sdk)
and [CLI](https://github.com/offline-function-calling/cli) were created.
The CLI uses the SDK.

- The SDK provides an easy to use API for function calling with offline
  models. The architecture features a provider-based design supporting
  multiple backends including
  [Ollama](https://github.com/ollama/ollama), with planned support for
  HuggingFace Transformers and MLX. The API draws inspiration from the
  [A2A protocol](https://a2a-protocol.org/latest/specification/),
  facilitating its use in future agent-based applications. The SDK
  incorporates all the functionality discovered through the course of
  the project, including prompting strategies, function discovery
  mechanisms, code generation and specification creation, function call
  parsing and execution, and robust model interaction patterns.
- The user-friendly CLI enables seamless interaction with offline
  function calling models. It makes creating and using tools with
  offline models extremely easy - users can simply place Python files
  containing their tools in a designated directory, and the CLI
  automatically discovers and registers functions based on their
  docstrings and type hints. The CLI also provides comprehensive
  multimodal input support via the models' image and audio capabilities,
  as well as the [markitdown](https://github.com/microsoft/markitdown)
  library for processing documents.

Efforts were also taken to integrate the function calling capabilities
of the Gemma 3 models into existing tools such as Ollama. It was
demonstrated that tool calls using the Ollama API worked with the
official Gemma model, provided a
[custom Modelfile](http://github.com/offline-function-calling/cli/tree/main/models).
The model was able to discover and use upto 20 tools in large context
conversations. While this integration remains under consideration, the
work established that the model satisfies the compatibility
requirements.

<div class="figures">
  <figure>
    <img src="/media/offline-function-calling/weather.png" alt="CLI using the get_weather tool" />
    <figcaption>
      The CLI in action, using a tool to answer the user's question.
    </figcaption>
  </figure>
  <figure>
    <img src="/media/offline-function-calling/expenses.png" alt="CLI using the record_expense tool from an image" />
    <figcaption>
      A demo of multimodal capabilities, where the model calls a tool
      based on
      data from an image.
    </figcaption>
  </figure>
</div>

### Fine-Tuning

I also explored the limitations of function calling in smaller, more
resource-efficient models as part of the project. The benchmark results
consistently showed that while larger models (12B and 27B parameters)
excelled at function calling tasks, smaller variants (1B and 4B)
struggled with multi-turn conversations and complex function calls,
limiting their practical deployment in resource-constrained
environments.

To bridge this gap, a dataset for function calling training is being
constructed by combining the scenarios from the benchmark suite with the
BFCLv3 corpus. This dataset, once completed, will represent a
comprehensive collection of function calling patterns that evaluate the
model based on a variety of parameters and scenarios. It can be used for
fine-tuning and enhancing the reasoning and function calling
capabilities of smaller Gemma 3 models (1B, 4B) and the Gemma 3n
variants (E2B, E4B) using the
[Unsloth](https://github.com/unslothai/unsloth) library for optimized
training performance.

---

## Acknowledgements

I would like to thank my GSoC mentors, Omar Sanseviero, Philipp Schmid,
and Paige Bailey, as well as Ravin Kumar, Gus Martins, Ivan Nardini, and
Thomas Mesnard from the Google Deepmind team deeply for their invaluable
guidance and feedback throughout the duration of my GSoC project. This
project would not be what it is without their help.
