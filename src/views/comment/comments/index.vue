<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>用户评论</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAdd">评论</el-button>
      </div>
      <el-timeline>
        <el-timeline-item v-for="item in commentList" :key="item.id" :timestamp="item.createdAt" placement="top">
          <el-card>
            <h4>
              <el-avatar :src="item.avatar"></el-avatar>
              {{ item.nikeName }} 说:
            </h4>
            <p>{{ item.content }}</p>
            <div class="button-container" >
              <el-button ink type="primary" icon="Delete" @click="handleDelete(item)" v-hasPermi="['comment:comments:remove']">删除</el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加评论对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="commentRef" :model="form" label-width="80px">
        <el-form-item label="评论内容" prop="content">
          <el-input type="textarea" v-model="form.content" :rows="4" placeholder="请输入评论内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div> 
</template>

<script setup name="Comment">
import { listComment, getComment, delComment, addComment, updateComment } from "@/api/comment/comments";

const { proxy } = getCurrentInstance();

const commentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    content: null,
    createdAt: null,
    updatedAt: null,
    nikeName: null,
    avatar: null, 
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户评论列表 */
function getList() {
  loading.value = true;
  listComment(queryParams.value).then(response => {
    commentList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    content: null,
    createdAt: null,
    updatedAt: null,
    userId: null
  };
  proxy.resetForm("commentRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "评论";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getComment(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户评论";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["commentRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateComment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addComment(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除用户评论编号为"' + _ids + '"的数据项？').then(function() {
    return delComment(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('comment/comment/export', {
    ...queryParams.value
  }, `comment_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.button-container {
  text-align: right;
  margin-top: 10px;
}
</style>