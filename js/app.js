'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.TaskManager = function () {

    var module = {
        reload: function reload() {
            $("#taskmanager").empty(); //vide element taskmanager
            TaskManager.display_tasks('#taskmanager');
        }
    };

    module.Task = function () {
        function Task() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'untitled';
            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            _classCallCheck(this, Task);

            this.name = name;
            this.duration = duration;
            this.tags = tags;
        }

        _createClass(Task, [{
            key: 'display',
            value: function display() {
                var container = $('<ul>');
                container.append(this.display_duration());
                container.append(this.display_tags());

                var item = $('<li>').addClass('task');
                item.append(this.display_name());
                item.append(container);

                return item;
            }
        }, {
            key: 'display_name',
            value: function display_name() {
                return $('<span>').addClass('name').text(this.name);
            }
        }, {
            key: 'display_duration',
            value: function display_duration() {
                var duration_item = $('<li>').addClass('duration').text(this.duration);

                if (this.duration <= 10) {
                    duration_item.addClass('short');
                } else if (this.duration >= 20) {
                    duration_item.addClass('long');
                }
                return duration_item;
            }
        }, {
            key: 'display_tags',
            value: function display_tags() {
                var _this = this;

                var tags_item = $('<li>').addClass('tags');
                tags_item.text(this.tags);

                var field = $('<input>').prop('type', 'text');
                var button = $('<input>').prop('type', 'submit');
                var form = $('<form>').append(field).append(button);
                var in_edit = false;

                tags_item.click(function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    var target = $(event.target);

                    if (target.is('li') && !in_edit) {
                        tags_item.empty();
                        tags_item.append(form);
                        in_edit = true;
                    }

                    if (target.is('input') && target.prop('type') === 'submit') {
                        _this.tags = field.val();
                        tags_item.empty();
                        tags_item.text(_this.tags);
                        in_edit = false;
                    }
                });

                return tags_item;
            }
        }]);

        return Task;
    }();

    module.Tag = function Tag() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['no_name'];

        _classCallCheck(this, Tag);

        this.name = name;
    };

    module.tasks = [];

    module.display_tasks = function (tag_id) {
        var container = $('<ul>').prop('id', 'tasks').prop('class', 'jumbotron');

        $(tag_id).append(container);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = module.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var task = _step.value;

                $(container).append(task.display());
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var name = $('<input>').prop('type', 'text').prop('id', 'name');
        var name_legend = $('<legend>').text("Name");
        var duration = $('<input>').prop('type', 'number').prop('id', 'duration');
        var duration_legend = $('<legend>').text("Duration");

        var tags = $('<input>').prop('type', 'text').prop('list', 'tag_datalist');
        var tag_datalist = $('<datalist>').prop('id', 'tag_datalist');
        var tags_legend = $('<legend>').text("Tags");
        var button = $('<input>').prop('type', 'submit').prop('value', 'Ajouter une tâche');
        var form = $('<form>').prop('id', 'add_task').append(name_legend).append(name).append(duration_legend).append(duration).append(tags_legend).append(tags).append("<br> <br>").append(button);

        form.submit(function (event) {
            event.stopPropagation();
            event.preventDefault();

            module.tasks.push(new TaskManager.Task(name.val(), duration.val(), tags.val()));
            module.reload();
        });

        $(tag_id).append(form);
    };

    return module;
}();

$(function () {
    TaskManager.tasks.push(new TaskManager.Task('tache1', 10, ['toto', 'trotro']));
    TaskManager.tasks.push(new TaskManager.Task('tache2', 25, 'tag2'));
    TaskManager.tasks.push(new TaskManager.Task('tache3', 17, 'tagueule'));

    TaskManager.display_tasks('#taskmanager');
});
