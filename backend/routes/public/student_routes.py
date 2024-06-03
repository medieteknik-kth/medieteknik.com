from flask import Blueprint, jsonify
from models.core import Student

public_student_bp = Blueprint('public_student', __name__)

@public_student_bp.route('/', methods=['GET'])
def get_students() -> dict:
    """Retrieves all students
    
    Returns:
        list[dict]: List of students
    """
    paginated_items = Student.query.paginate()
    
    students: list[Student] = paginated_items.items
    students_dict = [student.to_dict(is_public_route=True) for student in students]
    return jsonify(
        {
            "items": students_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )


@public_student_bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id: int) -> dict:
    """Retrieves a student
    
    Args:
        student_id (int): Student ID
    
    Returns:
        dict: Student
    """
    student: Student = Student.query.get(student_id)
    return jsonify(student.to_dict(is_public_route=True))
