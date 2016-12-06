window.TaskManager = (() => {

    let module = {
        reload(){
            $("#taskmanager").empty(); //vide element taskmanager
            TaskManager.display_tasks('#taskmanager');
        }
    };


    module.Task = class Task {
        constructor(name = 'untitled', duration = 0, tags = []) {
            this.name = name;
            this.duration = duration;
            this.tags = tags;
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

            let field = $('<input>').prop('type', 'text');
            let button = $('<input>').prop('type', 'submit');
            let form = $('<form>').append(field).append(button);
            let in_edit = false;

            tags_item.click((event) => {
                event.stopPropagation();
                event.preventDefault();

                let target = $(event.target);

                if (target.is('li') && !in_edit) {
                    tags_item.empty();
                    tags_item.append(form);
                    in_edit = true;
                }

                if (target.is('input') && target.prop('type') === 'submit') {
                    this.tags = field.val();
                    tags_item.empty();
                    tags_item.text(this.tags);
                    in_edit = false;
                }

            });

            return tags_item;
        }
    };

    module.Tag = class Tag {

        constructor(name = ['no_name']) {
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

        let tags = $('<input>').prop('type', 'text').prop('list', 'tag_datalist');
        let tag_datalist = $('<datalist>').prop('id', 'tag_datalist');
        let tags_legend = $('<legend>').text("Tags");
        let button = $('<input>').prop('type', 'submit').prop('value', 'Ajouter une tâche');
        let form = $('<form>').prop('id', 'add_task').append(name_legend)
            .append(name)
            .append(duration_legend)
            .append(duration)
            .append(tags_legend)
            .append(tags)
            .append("<br> <br>")
            .append(button);

        form.submit((event) => {
            event.stopPropagation();
            event.preventDefault();

            module.tasks.push(new TaskManager.Task(name.val(), duration.val(), tags.val()));
            module.reload();
        });

        $(tag_id).append(form);

    };

    return module;


})();

$(() => {
    TaskManager.tasks.push(new TaskManager.Task('tache1', 10, ['toto', 'trotro']));
    TaskManager.tasks.push(new TaskManager.Task('tache2', 25, 'tag2'));
    TaskManager.tasks.push(new TaskManager.Task('tache3', 17, 'tagueule'));

    TaskManager.display_tasks('#taskmanager');
});
