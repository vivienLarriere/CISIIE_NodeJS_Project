String.prototype.isEmpty = function () {
    if (!this.match(/\S/)) {
        return true;
    } else {
        return false;
    }
}


window.TaskManager = (() => {
    let module = {};

    module.Tag = class Tag {
        constructor(name = 'pas de tag') {
            this.name = name;
        }
    };
    module.Task = class Task {
        constructor(name = 'untitled', duration = 0, tags = []) {
            this.name = name;
            this.duration = duration;
            this.tags = tags;
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
            let tags_item_list = $('<ul>');
            for (let tag of this.tags) {
                tags_item_list.append($('<li>').addClass('tag').text(tag.name));
            }
            tags_item.append(tags_item_list);
            let btn = $('<input>').prop('type', 'submit');
            let buttonAddTags = $('<button>').text('Ajouter un tag');


            let form = $('<form>');
            for (let tag of this.tags) {
                let field = $('<input>').prop('type', 'text').prop('value', tag.name);
                form.append(field);
            }

            form.append(btn).append(buttonAddTags);

            let in_edit = false;


            tags_item.click((event) => {
                event.stopPropagation();
                event.preventDefault();

                let target = $(event.target);

                if (target.is('li') && !in_edit) {
                    tags_item.empty();

                    let form = $('<form>');
                    for (let tag of this.tags) {
                        let field = $('<input>').prop('type', 'text').prop('value', tag.name);
                        form.append(field);
                    }
                    form.append('<br>');
                    form.append(btn).append(buttonAddTags);

                    buttonAddTags.click((event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        let field = $('<input>').prop('type', 'text').attr('list', 'list_tags');
                        let data_list = $('<datalist>').prop('id', 'list_tags');
                        TaskManager.Tags().forEach(function (element) {
                            data_list.append($('<option>').prop('value', element));
                        });
                        form.append('<br>');
                        form.prepend(field);
                        form.append(data_list);
                        in_edit = false;

                    });

                    tags_item.append(form);
                    in_edit = true;
                }

                if (target.is('input') && target.prop('type') == 'submit') {
                    this.tags = [];
                    for (let newTag of tags_item[0].firstChild.childNodes) {
                        if (newTag.type == "text")
                            this.add_tag(newTag.value);
                        localStorage.setItem("taches", JSON.stringify(TaskManager.tasks));
                    }
                    tags_item.empty();
                    let tags_item_list = $('<ul>');
                    for (let tag of this.tags) {
                        tags_item_list.append($('<li>').addClass('tag').text(tag.name));
                    }
                    tags_item.append(tags_item_list);
                    in_edit = false;
                }
            });
            return tags_item;

        }
    };

    module.tasks = [];

    module.Tags = () => {
        let tags = [];
        for (let task of module.tasks) {
            task.tags.forEach(function (element) {
                tags.push(element.name);
            });
        }

        return tags.distinct();
    };

    module.addTask = () => {

        TaskManager.tasks.push(new TaskManager.Task($('.fieldName').val(), $('.fieldDuration').val(),));
        $('#tasks').replaceWith(TaskManager.display_tasks('#taskmanager'));
        window.localStorage.clear();
        window.localStorage.setItem("tasks", JSON.stringify(TaskManager.tasks));

    };

    module.display_form = () => {
        let fieldName = $('<input>').addClass('fieldName').prop('type', 'text');
        let fieldDuration = $('<input>').addClass('fieldDuration').prop('type', 'number');
        let button = $('<button>').addClass('buttonAdd').prop('type', 'submit').text('Ajouter');
        let buttonSave = $('<button>').text('Save');
        let form = $('<form>').append(fieldName).append(fieldDuration).append(button).append(buttonSave);
        button.click((event) => {
            event.stopPropagation();
            event.preventDefault();

            TaskManager.addTask();
        });

        buttonSave.click((event) => {

            $.ajax({
                type: "POST",
                url: "php/saveJson.php",
            }).done(function (data) {

                alert("save done")
            }).fail(function (data) {
                alert("error php")
            });
        });
        return form;
    };


    module.display_tasks = (tag_id) => {
        let container = $('<ul>').prop('id', 'tasks');
        $(tag_id).append(container);

        for (let task of module.tasks) {
            $(container).append(task.display());
        }
        $(container).append(module.display_form())

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

                TaskManager.tasks.push(new TaskManager.Task(task.name, task.duration, tags));
            }
            TaskManager.display_tasks('#taskmanager');
        } else {
            $.ajax({
                type: "GET",
                url: "json/files.json",
                dataType: "json",
            }).done(function (data) {
                for (let task of data.taches) {
                    let tags = [];
                    for (let tag of task.tags) {
                        tags.push(new TaskManager.Tag(tag));
                    }
                    TaskManager.tasks.push(new TaskManager.Task(task.name, task.duration, tags));
                }
                TaskManager.display_tasks('#taskmanager');
            }).fail(function (data) {
                $('#taskmanager').append("<p>").text("Erreur script ajax");
            });

        }
    }
);


Array.prototype.distinct = function () {
    var map = {}, out = [];

    for (var i = 0, l = this.length; i < l; i++) {
        if (map[this[i]]) {
            continue;
        }

        out.push(this[i]);
        map[this[i]] = 1;
    }

    return out;
}

