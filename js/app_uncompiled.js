window.TaskManager = (() => {

    let module = {};

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


        add_tag() {
            let field = $('<input>').prop('type', 'text');
            let button = $('<input>').prop('type', 'submit');
            let form = $('<form>').append(field).append(button);

            form.append(field);
            return field;
        }

        display_tags() {
            let tags_item = $('<li>').addClass('tags');
            tags_item.text(this.tags);
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

    module.tasks = [];

    module.display_tasks = (tag_id) => {
        let container = $('<ul>').prop('id', 'tasks');
        $(tag_id).append(container);
        for (let task of module.tasks) {
            $(container).append(task.display());
        }
    };

    module.add_tag = () => {
        let container = $('<div>').prop('id', 'form_tag');
        $(container).append()
    };

    return module;
})();

$(() => {
    TaskManager.tasks.push(new TaskManager.Task('tache1', 10, 'tag1'));
    TaskManager.tasks.push(new TaskManager.Task('tache2', 25, 'tag2'));
    TaskManager.tasks.push(new TaskManager.Task('tache3', 17, 'tagueule'));

    TaskManager.display_tasks('#taskmanager');
});
