window.TaskManager = (() => {

    let tags_array = [];
    let module = {
        reload(){
            $("#taskmanager").empty(); //vide element taskmanager
            TaskManager.display_tasks('#taskmanager');
            $("li:empty").text("That's empty :(").prop('class', 'no_tags');
        },
        add_tags_array(tag){
            if ($.inArray(tag, tags_array) === -1)
                tags_array.push(tag);
        }
    };


    module.Task = class Task {
        constructor(name = 'untitled', duration = 0, tags = []) {
            this.name = name;
            this.duration = duration;
            this.tags = tags;
            if (Array.isArray(tags)) {
                $(tags).each(function (i, item) {
                    module.add_tags_array(item);
                });
            } else {
                module.add_tags_array(tags)
            }
        }


        add_tag(tag) {
            this.tags.push(new TaskManager.Tag(tag));
        }

        display() {
            let container = $('<ul>');
            container.append(this.display_duration());
            container.append(this.display_tags());

            let item = $('<li>').addClass('task');
            item.append(this.display_name());
            item.append(container);

            return item;
        }

        display_name() {
            return $('<span>').addClass('name').text(this.name);
        }

        display_duration() {
            let duration_item = $('<li>').addClass('duration').text(this.duration);

            if (this.duration <= 10) {
                duration_item.addClass('short');
            } else if (this.duration >= 20) {
                duration_item.addClass('long');
            }
            return duration_item;
        }

        display_tags() {
            let tags_item = $('<li>').addClass('tags');
            tags_item.text(this.tags);
            let last_items = tags_item.text();

            let field = $('<input>').prop('type', 'text');
            let button = $('<input>').prop('type', 'submit');
            let form = $('<form>').append(field).append(button);
            let in_edit = false;

            tags_item.click((event) => {
                event.stopPropagation();
                event.preventDefault();

                last_items = tags_item.text();
                let target = $(event.target);


                if (target.is('li') && !in_edit) {
                    tags_item.empty();
                    tags_item.append(form);
                    in_edit = true;
                }

                if (target.is('input') && target.prop('type') === 'submit') {
                    this.tags = [];
                    for (let newTag of tags_item[0].firstChild.childNodes) {
                        if (newTag.type == "text")
                            this.add_tag(newTag.value);
                        localStorage.setItem("task", JSON.stringify(TaskManager.tasks));
                    }
                    tags_item.empty();
                    let tags_list = $('<ul>');
                    for (let tag of this.tags) {
                        tags_list.append($('<li>').addClass('tag').text(tag.name));
                    }
                    tags_item.append(tags_list);
                    in_edit = false;
                }

                $("li:empty").text("That's empty :(").prop('class', 'no_tags');


            });

            $('body').click((event) => {
                if (tags_item.text() === "")
                    tags_item.text(last_items).addClass('tags');
                in_edit = false;
                $("li:empty").text("That's empty :(").prop('class', 'no_tags');
            });

            return tags_item;
        }
    };

    module.Tag = class Tag {
        constructor(name = 'No tags :(') {
            this.name = name;
        }
    };

    module.tasks = [];

    module.display_tasks = (tag_id) => {
        let container = $('<ul>').prop('id', 'tasks').prop('class', 'jumbotron');

        $(tag_id).append(container);

        for (let task of module.tasks) {
            $(container).append(task.display());
        }
        let name = $('<input>').prop('type', 'text').prop('id', 'name');
        let name_legend = $('<legend>').text("Name");
        let duration = $('<input>').prop('type', 'number').prop('id', 'duration');
        let duration_legend = $('<legend>').text("Duration");

        let tags = $('<input list="tag_datalist">').prop('class', 'toto').prop('type', 'text');
        let tag_datalist = $('<datalist>').prop('id', 'tag_datalist');
        let tags_legend = $('<legend>').text("Tags");
        let button = $('<input>').prop('type', 'submit').prop('value', 'Ajouter une tâche');
        let form = $('<form>').prop('id', 'add_task').append(name_legend)
            .append(name)
            .append(duration_legend)
            .append(duration)
            .append(tags_legend)
            .append(tags)
            .append(tag_datalist)
            .append("<br> <br>")
            .append(button);

        $(tags_array).each(function (i, item) {
            tag_datalist.append($('<option>').prop('value', item));
        });


        form.submit((event) => {
            event.stopPropagation();
            event.preventDefault();
            let task = new TaskManager.Task(name.val(), duration.val(), tags.val());
            module.tasks.push(task);
            module.reload();
            window.localStorage.clear();
            window.localStorage.setItem('tasks', JSON.stringify(TaskManager.tasks));
            $.post("php/json_handler.php", {
                    tasks: TaskManager.tasks,
                },
                {}).done(function (data) {
                console.log('Ajout OK');
            }).fail(function (data) {
                console.log('Erreur lors de l\'ajout');
            });
        });

        $(tag_id).append(form);

    };

    return module;


})();

$(() => {
    if (window.localStorage.getItem("tasks") != undefined) {
        for (let task of JSON.parse(window.localStorage.getItem("tasks"))) {
            let tags = [];
            let name = "";
            if (task.tags.length != 0) {
                for (let tag of task.tags) {
                    name = name + tag.name + "  ";
                }
                tags.push(new TaskManager.Tag(name));
            }

            TaskManager.tasks.push(new TaskManager.Task(task.name, task.duration, task.tags));
        }
        TaskManager.display_tasks('#taskmanager');
    } else {
        $.ajax({
            type: "GET",
            url: "save.json",
            dataType: "json",
        }).done(function (data) {
            for (let task of data.tasks) {
                let tags = [];
                for (let tag of task.tags) {
                    tags.push(new TaskManager.Tag(tag));
                }
                TaskManager.tasks.push(new TaskManager.Task(task.name, task.duration, task.tags));
            }
            TaskManager.display_tasks('#taskmanager');
        }).fail(function () {
            TaskManager.display_tasks('#taskmanager');
        });

    }
});