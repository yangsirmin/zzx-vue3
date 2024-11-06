<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物品名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入物品名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物品种类" prop="category">
          <el-select v-model="queryParams.category" placeholder="请选择物品种类" clearable>
            <el-option v-for="item in categories" :key="item.id" :label="item.categoryName" :value="item.categoryName"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="领取地点" prop="locationFound">
        <el-select v-model="queryParams.locationFound" placeholder="请选择领取地点" clearable>
          <el-option v-for="item in locations" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物品状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择物品状态" clearable>
          <el-option
            v-for="dict in tb_items"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['items:items:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['items:items:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['items:items:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['items:items:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="itemsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物品ID，自动增长" align="center" prop="id" />
      <el-table-column label="物品名称" align="center" prop="itemName" />
      <el-table-column label="物品种类" align="center" prop="category" />
      <el-table-column label="物品描述" align="center" prop="description" />
      <el-table-column label="发现地点" align="center" prop="locationFound" />
      <el-table-column label="发现日期" align="center" prop="dateFound" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dateFound, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物品状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="tb_items" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['items:items:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['items:items:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改物品管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="itemsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物品名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物品名称" />
        </el-form-item>
        <el-form-item label="物品种类" prop="category">
          <el-select v-model="form.category" placeholder="请选择物品种类">
            <el-option v-for="item in categories" :key="item.id" :label="item.categoryName" :value="item.categoryName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="领取地点" prop="locationFound">
          <el-select v-model="form.locationFound" placeholder="请选择领取地点" clearable>
            <el-option v-for="item in locations" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发现日期" prop="dateFound">
          <el-date-picker clearable
            v-model="form.dateFound"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发现日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物品状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择物品状态">
            <el-option
              v-for="dict in tb_items"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <image-upload v-model="form.image"/>
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

<script setup name="Items">
import { listItems, getItems, delItems, addItems, updateItems } from "@/api/items/items";
import { listCategories } from "@/api/categories/categories"
import { listLocations } from "@/api/locations/locations";

const { proxy } = getCurrentInstance();
const { tb_items } = proxy.useDict('tb_items');

const itemsList = ref([]);
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
    itemName: null,
    category: null,
    locationFound: null,
    status: null,
  },
  rules: {
    itemName: [
      { required: true, message: "物品名称不能为空", trigger: "blur" }
    ],
    category: [
      { required: true, message: "物品种类不能为空", trigger: "blur" }
    ],
    locationFound: [
      { required: true, message: "发现地点不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "物品状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询物品管理列表 */
function getList() {
  loading.value = true;
  listItems(queryParams.value).then(response => {
    itemsList.value = response.rows;
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
    itemName: null,
    category: null,
    description: null,
    locationFound: null,
    dateFound: null,
    status: null,
    createdAt: null,
    updatedAt: null,
    userId: null,
    image: null
  };
  proxy.resetForm("itemsRef");
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
  title.value = "添加物品管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getItems(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改物品管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["itemsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateItems(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addItems(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除此物品的数据？').then(function() {
    return delItems(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('items/items/export', {
    ...queryParams.value
  }, `items_${new Date().getTime()}.xlsx`)
}

/**获取全部种类 */
const categories=ref([]);
function getAllCategories(){
  listCategories({
    pageNum: 1,
    pageSize: 100
  }).then(response => {
    categories.value = response.rows;
  });
}

const locations=ref([]);
function getAllLocations(){
  listLocations({
    pageNum: 1,
    pageSize: 100
  }).then(response => {
    locations.value = response.rows;
  });
}

getAllLocations();
getAllCategories();
getList();
</script>
