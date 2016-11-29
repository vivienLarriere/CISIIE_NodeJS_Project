'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.TaskManager = function () {

    var module = {};

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
            key: 'add_tag',
            value: function add_tag() {
                var field = $('<input>').prop('type', 'text');
                var button = $('<input>').prop('type', 'submit');
                var form = $('<form>').append(field).append(button);

                form.append(field);
                return field;
            }
        }, {
            key: 'display_tags',
            value: function display_tags() {
                var _this = this;

                var tags_item = $('<li>').addClass('tags');
                tags_item.text(this.tags);
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

    module.tasks = [];

    module.display_tasks = function (tag_id) {
        var container = $('<ul>').prop('id', 'tasks');
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
    };

    module.add_tag = function () {
        var container = $('<div>').prop('id', 'form_tag');
        $(container).append();
    };

    return module;
}();

$(function () {
    TaskManager.tasks.push(new TaskManager.Task('tache1', 10, 'tag1'));
    TaskManager.tasks.push(new TaskManager.Task('tache2', 25, 'tag2'));
    TaskManager.tasks.push(new TaskManager.Task('tache3', 17, 'tagueule'));

    TaskManager.display_tasks('#taskmanager');
});
