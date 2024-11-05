from flask import Flask, render_template, jsonify, request
from datetime import datetime
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

# Load initial todo data
todos = [
    {"id": 1, "title": "Review Project Proposal", "date": "2025/12/30 14:30", "place": "", "content": ""},
    {"id": 2, "title": "Team Meeting", "date": "2025/12/30 09:00", "place": "", "content": ""},
    {"id": 3, "title": "Client Presentation", "date": "2025/12/30 15:00", "place": "", "content": ""},
    {"id": 4, "title": "Submit Monthly Report", "date": "2025/12/30 17:00", "place": "", "content": ""},
    {"id": 5, "title": "Project Deadline", "date": "2024/09/01 16:00", "place": "", "content": ""},
    {"id": 6, "title": "Weekly Planning", "date": "2024/09/10 10:00", "place": "", "content": ""},
    {"id": 7, "title": "Client Meeting", "date": "2024/09/12 13:30", "place": "", "content": ""}
]

done_items = []

def get_status(date_str):
    try:
        item_date = datetime.strptime(date_str, "%Y/%m/%d %H:%M")
        now = datetime.strptime("2024/10/29 00:00", "%Y/%m/%d %H:%M")  # Fixed date for comparison
        return "overdue" if item_date < now else "pending"
    except:
        return "pending"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos_with_status = []
    for todo in todos:
        todo_copy = todo.copy()
        todo_copy['status'] = get_status(todo['date'])
        todos_with_status.append(todo_copy)
    
    sorted_todos = sorted(todos_with_status, key=lambda x: datetime.strptime(x['date'], "%Y/%m/%d %H:%M"))
    sorted_done = sorted(done_items, key=lambda x: datetime.strptime(x['date'], "%Y/%m/%d %H:%M"))
    
    return jsonify({
        'todos': sorted_todos,
        'done_items': sorted_done
    })

@app.route('/api/todos/<int:todo_id>/toggle', methods=['POST'])
def toggle_todo(todo_id):
    if request.json.get('done'):
        todo = next((t for t in todos if t['id'] == todo_id), None)
        if todo:
            todos.remove(todo)
            done_items.insert(0, {**todo, 'status': 'done'})
    else:
        done_item = next((t for t in done_items if t['id'] == todo_id), None)
        if done_item:
            done_items.remove(done_item)
            done_item.pop('status', None)
            todos.append(done_item)
    
    return jsonify({'success': True})

@app.route('/api/todos/<int:todo_id>/edit', methods=['POST'])
def edit_todo(todo_id):
    data = request.json
    todo = next((t for t in todos if t['id'] == todo_id), None)
    if not todo:
        todo = next((t for t in done_items if t['id'] == todo_id), None)
    
    if todo:
        todo.update({
            'title': data['title'],
            'date': data['date'],
            'place': data['place'],
            'link': data['link'],
            'content': data['content']
        })
    
    return jsonify({'success': True})

@app.route('/api/current-time', methods=['GET'])
def get_current_time():
    now = datetime.strptime("2024/10/29 00:00", "%Y/%m/%d %H:%M")  # Fixed date
    return jsonify({
        'datetime': now.strftime("%Y/%m/%d %H:%M")
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)