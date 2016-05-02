# daft
### Dead simple Docker scripting

*Please note that this library is currently not functional. This document describes the minimum feature set needed for release.*

## Using Daft

Daft is an automation tool for creating custom builds and deployments quickly and repeatably.

After you create a build.daft file in the root of your project, a simple

    docker run daft

will run your automation to completion. Note that you will of course need to have docker installed.

If you use the standard daft header in your build.daft, then you can simply run

    ./build.daft

to run your build.

Using labels allows you to stop the build earlier, so for instance

    ./build.daft compile

will stop the build after finishing the compile phase. You're free to define phases as you please, but they must execute in order.

## What is a daft script

Daft is actually a scripting language for Docker containers. A Daft script file is separated into 3 sections: the script, the data, and the rest. The rest is ignored by the interpreter, while the data is interpreted as a standard yaml document.

The script is a series of steps grouped into phases. The steps are executed in order until the interpreter encounters an error, or the steps in the specified phase are completed. There are only two kinds of steps, shell commands and Docker commands. A shell command is a bash command line, while a Docker command is a custom expression for daft.

A Docker command has three parts: the docker image, the path mapping and the command line arguments. The interpreter will fetch the docker image, infer the correct docker command line arguments for the path mapping and then start the docker container. The interpreter will wait for the docker execution to finish and, if successful, will then proceed with the next step.

## Daft script syntax

The three sections of a daft script are separated by three or more hyphens (---). Note that the sections are split before any other processing begins on the script, therefore three or more hyphens are not allowed for any other reason in the file, even in a string literal.

In the script portion of the file, comments are important for understanding intent. There are line and block comments

    # This is a line comment. It begins with a hash (#) anywhere on the line, and ends at the end of the line.

    #!
       A shebang (#!) starts a block comment.
       It can go for several lines.
       A block comment is explicitly closed by a bang-hash (! followed by #).
    !#

It might seem weird at first to use #!...!# as the block comment syntax, but it will become clear when we get to the
standard daft header below.

Aside from the comments, the scripts are mostly a series of steps. for instance a script could look like

    autoconf
    ./configure
    make

This probably won't do what you'd expect however. This script intends to run three separate docker containers built from images named "autoconf", "./configure", and "make" using their default locations and command line arguments. This is almost certainly not correct. If instead the script were

    > autoconf
    > ./configure
    > make

Then it might be a little bit closer to what you'd expect. Starting a line with a greater-than (>) tells the script
interpreter to treat the rest of the line as a literal shell command. The downside here of course is that you need
to have autoconf installed on your machine, and there's no telling whether that's true. Daft is completely portable,
if you use it correctly.

Most steps will be a Docker command instead of a shell command. A docker command is written as the docker image,
followed by a json path identifier into the yaml data object, followed by commandline arguments that should be passed
to the Docker command container. For instance

    daft-maven childProject.root -X compile

Asks the daft script interpreter to run the Docker image called "daft-maven" against the path mappings identified in the yaml under the key "childProject.root" and to pass "-X compile" to the docker container on startup. Just for completeness, here's the full script with the data section

    daft-maven childProject.root -X compile
    ---
    childProject:
      root:
        "/project": children/first

what this means is that the "daft-maven" image (which doesn't exist, by the way), has been configured to run against
a maven project in "/project". The actual execution within the interpreter for the previous example might look like.

    docker run daft-maven -v /project:children/first -X compile

Phases within the script are marked by labels

    aLabel:

A phase includes all the steps to the next label, so for instance

    compile:
    javac ...
    package:
    jar ...

In this example, the compile phase includes one command (javac). Sometimes you'll need to refer to a repository, for instance

    docker.fuwjax.com/daft-metalsmith web.src

If it gets too frustrating to type out the full image path, then path aliases are allowed.

    alias metalsmith docker.fuwjax.com/daft-metalsmith
    metalsmith web.src

Inline json is acceptable if you don't want to use the data lookup. That means it's legal to use

    metalsmith {"/project": "children/first"}

Of if you just want to use all the defaults (rarely possible)

    metalsmith {}

In the command line arguments, shell commands or yaml data, it is acceptable to use environment variables. So for instance
if there is an environment variable called VERSION

    > touch v${VERSION}.txt
    metalsmith project $VERSION
    ---
    project:
      /target: build/$VERSION

Variables can even reference yaml properties.
