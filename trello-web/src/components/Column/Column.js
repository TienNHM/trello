import React from 'react';

import './Column.scss'

import Task from 'components/Task/Task'

function Column() {
    return (
        <div className="column">
            <header>Brainstorm</header>
            <ul className="task-list">
                <Task />
                <Task />
                <Task />
                <Task />
                {/* <li className="task-item">Số lượng tối ưu cho một nhóm chỉ nên ở mức 5-7 người</li>
                <li className="task-item">Tất cả mọi người đều có quyền lợi và nghĩa vụ đóng góp ý tưởng</li>
                <li className="task-item">Không được phép chỉ trích hoặc bác bỏ bất cứ ý tưởng nào trong quá trình này</li>
                <li className="task-item">Những ý tưởng có phần phá cách, mới lạ được khuyến khích</li>
                <li className="task-item">Số lượng tối ưu cho một nhóm chỉ nên ở mức 5-7 người</li>
                <li className="task-item">Tất cả mọi người đều có quyền lợi và nghĩa vụ đóng góp ý tưởng</li>
                <li className="task-item">Không được phép chỉ trích hoặc bác bỏ bất cứ ý tưởng nào trong quá trình này</li>
                <li className="task-item">Những ý tưởng có phần phá cách, mới lạ được khuyến khích</li> */}
            </ul>
            <footer>Add another card</footer>
        </div>
    )
}

export default Column;