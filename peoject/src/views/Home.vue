<template>
  <div class="home-container">
    <header class="header">
      <h1>Work Order Management</h1>
      <div class="header-right">
        <span>Welcome, {{ userInfo.username }}</span>
        <a-button type="default" @click="handleLogout">Logout</a-button>
      </div>
    </header>

    <div class="content">
      <div class="table-section">
        <a-table :columns="columns" :data-source="workOrders" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button 
                type="danger" 
                size="small" 
                @click="handleDelete(record.id)"
              >
                Delete
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

      <div class="chart-section">
        <h3>Project Hours Distribution</h3>
        <div ref="chartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
const router = useRouter();
const userInfo = ref(JSON.parse(localStorage.getItem('user') || '{}'));
const isAdmin = computed(() => userInfo.value.role === 'admin');
const workOrders = ref([
 { id: '001', project: 'Road Project A', overtime: true, hours: 3.5, created_at: '2024-04-10 10:30' },
 { id: '002', project: 'Bridge Maintenance B', overtime: false, hours: 2, created_at: '2024-04-09 13:00' },
 { id: '003', project: 'Pipeline Fix C', overtime: true, hours: 4.5, created_at: '2024-04-08 08:00' },
 { id: '004', project: 'Bridge Maintenance B', overtime: true, hours: 3, created_at: '2024-04-07 16:45' },
 { id: '005', project: 'Tunnel Cleaning D', overtime: false, hours: 8.1, created_at: '2024-04-03 11:43' }
]);
const baseColumns = [
 { title: 'ID', dataIndex: 'id', key: 'id' },
 { title: 'Project', dataIndex: 'project', key: 'project' },
 { title: 'Overtime', dataIndex: 'overtime', key: 'overtime', customRender: ({ text }) => text ? 'Yes' : 'No' },
 { title: 'Hours', dataIndex: 'hours', key: 'hours' },
 { title: 'Created At', dataIndex: 'created_at', key: 'created_at' }
];

const columns = computed(() => {
 if (isAdmin.value) {
 return [...baseColumns, { title: 'Action', key: 'action' }];
 }
 return baseColumns;
});
const chartRef = ref(null);
let chartInstance = null;
const chartData = computed(() => {
 const grouped = {};
 workOrders.value.forEach(item => {
 if (!grouped[item.project]) {
 grouped[item.project] = 0;
 }
 grouped[item.project] += item.hours;
 });
 return {
 projects: Object.keys(grouped),
 hours: Object.values(grouped)
 };
});
const initChart = () => {
 if (chartRef.value) {
 chartInstance = echarts.init(chartRef.value);
 updateChart();
 }
};
const updateChart = () => {
 if (chartInstance) {
 const option = {
 xAxis: {
 type: 'category',
 data: chartData.value.projects,
 axisLabel: {
 interval: 0,
 rotate: 30
 }
 },
 yAxis: {
 type: 'value'
 },
 series: [{
 data: chartData.value.hours,
 type: 'bar',
 color: '#1890ff'
 }]
 };
 chartInstance.setOption(option);
 }
};
const handleDelete = (id) => {
 workOrders.value = workOrders.value.filter(item => item.id !== id);
 updateChart();
};
const handleLogout = () => {
 localStorage.removeItem('user');
 router.push('/');
};
onMounted(() => {
 initChart();
 window.addEventListener('resize', () => {
 chartInstance?.resize();
 });
});
onUnmounted(() => {
 chartInstance?.dispose();
});
</script>

<style lang="less" scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  h1 {
    margin: 0;
    color: #1890ff;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    span {
      color: #666;
    }
  }
}

.content {
  background-color: #fff;
  padding: 24px;
  display: flex;
  flex-direction: row;
}

.table-section {
  flex: 1;
  border-radius: 8px;
  padding: 16px;
}

.chart-section {
  width: 500px;
  border-radius: 8px;
  padding: 16px;
  h3 {
    margin: 0 0 16px 0;
    color: #333;
  }
  .chart {
    height: 400px;
  }
}
</style>