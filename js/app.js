"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.TaskManager = function () {

    var tags_array = [];
    var module = {
        reload: function reload() {
            $("#taskmanager").empty(); //vide element taskmanager
            TaskManager.display_tasks('#taskmanager');
            $("li:empty").text("That's empty :(").prop('class', 'no_tags');
        },
        add_tags_array: function add_tags_array(tag) {
            if ($.inArray(tag, tags_array) === -1) tags_array.push(tag);
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
            if (Array.isArray(tags)) {
                $(tags).each(function (i, item) {
                    module.add_tags_array(item);
                });
            } else {
                module.add_tags_array(tags);
            }
        }

        _createClass(Task, [{
            key: "add_tag",
            value: function add_tag(tag) {
                this.tags.push(new TaskManager.Tag(tag));
            }
        }, {
            key: "display",
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
            key: "display_name",
            value: function display_name() {
                return $('<span>').addClass('name').text(this.name);
            }
        }, {
            key: "display_duration",
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
            key: "display_tags",
            value: function display_tags() {
                var _this = this;

                var tags_item = $('<li>').addClass('tags');
                tags_item.text(this.tags);
                var last_items = tags_item.text();

                var field = $('<input>').prop('type', 'text');
                var button = $('<input>').prop('type', 'submit');
                var form = $('<form>').append(field).append(button);
                var in_edit = false;

                tags_item.click(function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    last_items = tags_item.text();
                    var target = $(event.target);

                    if (target.is('li') && !in_edit) {
                        tags_item.empty();
                        tags_item.append(form);
                        in_edit = true;
                    }

                    if (target.is('input') && target.prop('type') === 'submit') {
                        _this.tags = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = tags_item[0].firstChild.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var newTag = _step.value;

                                if (newTag.type == "text") _this.add_tag(newTag.value);
                                localStorage.setItem("task", JSON.stringify(TaskManager.tasks));
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

                        tags_item.empty();
                        var tags_list = $('<ul>');
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _this.tags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var tag = _step2.value;

                                tags_list.append($('<li>').addClass('tag').text(tag.name));
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        tags_item.append(tags_list);
                        in_edit = false;
                    }

                    $("li:empty").text("That's empty :(").prop('class', 'no_tags');
                });

                $('body').click(function (event) {
                    if (tags_item.text() === "") tags_item.text(last_items).addClass('tags');
                    in_edit = false;
                    $("li:empty").text("That's empty :(").prop('class', 'no_tags');
                });

                return tags_item;
            }
        }]);

        return Task;
    }();

    module.Tag = function Tag() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'No tags :(';

        _classCallCheck(this, Tag);

        this.name = name;
    };

    module.tasks = [];

    module.display_tasks = function (tag_id) {
        var container = $('<ul>').prop('id', 'tasks').prop('class', 'jumbotron');

        $(tag_id).append(container);

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = module.tasks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var task = _step3.value;

                $(container).append(task.display());
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        var name = $('<input>').prop('type', 'text').prop('id', 'name');
        var name_legend = $('<legend>').text("Name");
        var duration = $('<input>').prop('type', 'number').prop('id', 'duration');
        var duration_legend = $('<legend>').text("Duration");

        var tags = $('<input list="tag_datalist">').prop('class', 'toto').prop('type', 'text');
        var tag_datalist = $('<datalist>').prop('id', 'tag_datalist');
        var tags_legend = $('<legend>').text("Tags");
        var button = $('<input>').prop('type', 'submit').prop('value', 'Ajouter une tâche');
        var form = $('<form>').prop('id', 'add_task').append(name_legend).append(name).append(duration_legend).append(duration).append(tags_legend).append(tags).append(tag_datalist).append("<br> <br>").append(button);

        $(tags_array).each(function (i, item) {
            tag_datalist.append($('<option>').prop('value', item));
        });

        form.submit(function (event) {
            event.stopPropagation();
            event.preventDefault();
            var task = new TaskManager.Task(name.val(), duration.val(), tags.val());
            module.tasks.push(task);
            module.reload();
            window.localStorage.clear();
            window.localStorage.setItem('tasks', JSON.stringify(TaskManager.tasks));
            $.post("php/json_handler.php", {
                tasks: TaskManager.tasks
            }, {}).done(function (data) {
                console.log('Ajout OK');
            }).fail(function (data) {
                console.log('Erreur lors de l\'ajout');
            });
        });

        $(tag_id).append(form);
    };

    return module;
}();

$(function () {
    if (window.localStorage.getItem("tasks") != undefined) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = JSON.parse(window.localStorage.getItem("tasks"))[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var task = _step4.value;

                var tags = [];
                var name = "";
                if (task.tags.length != 0) {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = task.tags[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var tag = _step5.value;

                            name = name + tag.name + "  ";
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    tags.push(new TaskManager.Tag(name));
                }

                TaskManager.tasks.push(new TaskManager.Task(task.name, task.duration, task.tags));
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        TaskManager.display_tasks('#taskmanager');
    } else {
        $.ajax({
            type: "GET",
            url: "save.json",
            dataType: "json"
        }).done(function (data) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = data.tasks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _task = _step6.value;

                    var _tags = [];
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = _task.tags[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var _tag = _step7.value;

                            _tags.push(new TaskManager.Tag(_tag));
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }

                    TaskManager.tasks.push(new TaskManager.Task(_task.name, _task.duration, _task.tags));
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            TaskManager.display_tasks('#taskmanager');
        }).fail(function () {
            TaskManager.display_tasks('#taskmanager');
        });
    }
});
