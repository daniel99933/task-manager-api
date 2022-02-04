const request = require("supertest")
const app = require('../src/app')
const Task = require("../src/models/task")
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "From my test suite"
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test("Should fetch user tasks", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(2)
})

test("Should not delete other users task", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test("Should not create task with invalid description/completed", async () => {
    await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Test",
            completed: "Hello World"
        })
        .expect(400)
})

test("Should not update task with invalid description/completed", async () => {
    const update = {
        description: "Changed title",
        completed: "HelloWorld"
    }

    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(400)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toMatchObject(update)
})

test("Should delete user task", async () => {
    await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(taskThree._id)
    expect(task).toBeNull()
})

test("Should not delete task if unauthenticated", async () => {
    await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .send()
        .expect(401)
    const task = Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})

test("Should not update other users task", async () => {
    const update = {
        description: "Not third task",
        completed: false
    }

    await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(404)
    const task = Task.findById(taskThree._id)
    expect(task).not.toMatchObject(update)
})

test("Should fetch user task by id", async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(taskOne._id)
    expect(task.description).toEqual(response.body.description)
})

test("Should not fetch user task by id if unauthenticated", async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

test("Should not fetch other users task by id", async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

test("Should fetch only completed tasks", async () => {
    const response = await request(app)
        .get("/tasks?completed=true")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const tasks = await Task.find({
        completed: true,
        owner: userOneId
    })
    expect(tasks.length).toBe(response.body.length)
})

test("Should fetch only incompleted tasks", async () => {
    const response = await request(app)
        .get("/tasks?completed=false")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const tasks = await Task.find({
        completed: false,
        owner: userOneId
    })
    expect(tasks.length).toBe(response.body.length)
})

test("Should sort tasks by description/completed/createdAt/updatedAt", async () => {
    const response = await request(app)
        .get("/tasks?sortBy=createdAt:desc")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].description).toBe("Second task")
    expect(response.body[1].description).toBe("First task")
})

test("Should fetch page of tasks", async () => {
    const response = await request(app)
        .get("/tasks?limit=1&skip=1")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(1)
})