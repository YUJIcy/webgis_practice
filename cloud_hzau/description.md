# 用户界面设计说明
- 呈现方式：HTML CSS JavaScript
- 编程软件：VS Code + liveServer
- 项目环境：node.js express.js
- API调用：高德地图 JS API(2.0)
## 部分功能展示：
1. 登陆及信息验系统：学生及教师等校内用户登陆验证、校外访客登陆
2. 地图展示系统：三维校园地图展示功能、步行导航功能
3. 智慧教室系统：教室状态表格化展示及查询
5. 智慧图书馆系统：图书馆书籍检索、书籍借阅状况查询、图书馆座位状态查询
6. 智慧宿舍系统：电费查询及充值缴费
7. 智慧充电桩：充电桩状态查询（界面与教室状态查询相似）
8. 实时校车系统：校车站点及路线展示
9. 文体活动服务系统：文体活动查询（界面与教室状态查询相似）
## 设计说明与解释：
本部分仅着重于部分前端页面的设计与展示，由于项目实际编码时间与编码成员的技术能力有限，未直接采取基于Android或iOS系统进行设计的方式，而是采取html+css+javascript网页设计这种难度相对较低、落实速度相对较快的技术手段进行页面的展示及部分功能的预设计。且同样由于时间问题，仅对用户的登陆验证部分进行了数据库的注入，界面展示中教室状态、书籍检索、座位查询、宿舍电费查询的展示数据分别来自于校教务系统、校图书馆管理系统、座位查询系统、校宿舍购电系统的近期相关数据。本次界面设计处于整体软件实现过程的准备阶段，且截止目前，仍有大量功能并未得到展示。

---

# UI Design Description
- **Presentation:** HTML CSS JavaScript
- **IDE:** VS Code + Live Server
- **Environment:** Node.js Express.js
- **API:** Amap JS API (2.0)

## Feature Showcase:
1. **Login & Authentication System:** Login verification for on-campus users such as students and teachers, as well as guest login for external visitors.
2. **Map Display System:** 3D campus map display and walking navigation.
3. **Smart Classroom System:** Tabular display and search of classroom status.
4. **Smart Library System:** Book search, borrowing status inquiry, and library seat availability inquiry.
5. **Smart Dormitory System:** Electricity bill inquiry, top-up, and payment.
6. **Smart Charging Stations:** Charging station status inquiry (UI similar to classroom status inquiry).
7. **Real-time Campus Shuttle System:** Display of shuttle stops and routes.
8. **Culture & Sports Activity Service System:** Activity inquiry (UI similar to classroom status inquiry).

## Design Notes & Explanation:
This section focuses only on the design and presentation of select front-end pages. Due to limited development time and the technical proficiency of team members, the project was not built directly on Android or iOS platforms. Instead, a relatively accessible and faster-to-implement approach — HTML + CSS + JavaScript web design — was adopted for page presentation and the preliminary design of certain features. Likewise constrained by time, only the user login authentication module was connected to a database. The data displayed in the classroom status, book search, seat inquiry, and dormitory electricity bill inquiry interfaces are sourced from recent records in the university's academic affairs system, library management system, seat reservation system, and dormitory electricity purchase system, respectively. This UI design phase represents the preparatory stage of the overall software implementation process, and as of now, a significant number of features remain unimplemented.
