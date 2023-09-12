import { useEffect, useState } from 'react';
import { Button, Card, Divider, FormInstance, Input, message, Modal, Radio, Table, Tag } from 'antd';
import { ResponseData } from '@/utils/request';
import {
  updPassword,
  // createDeviceData,
  getTokenData,
  generateImage,
  queryList,
  removeData,
  updateData as updateDataService,
} from './service';
import { PaginationConfig, TableListItem, IResponseData } from './data';

import CreateForm from './components/CreateForm';
import DeviceForm from './components/DeviceForm';
import UpdateForm from './components/UpdateForm';
import { ColumnsType } from 'antd/lib/table';

function App() {
  // 获取数据
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<TableListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
    pageNum: 1,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  const getList = async (current: number): Promise<void> => {
    setLoading(true);
    const response: ResponseData<IResponseData> = await queryList({
      pageNum: current,
      pageSize: 10,
    });
    const data = response.data || { list: [], total: 0 };

    setList(data.list || []);
    setPagination({
      ...pagination,
      current,
      total: data.total || 0,
    });

    setLoading(false);
  };
  useEffect(() => {
    getList(1);
  }, []);

  // 删除
  const [deleteLoading, setDeleteLoading] = useState<number[]>([]);
  const deleteTableData = (id: number) => {
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setDeleteLoading([id]);

        await removeData(id.toString());
        message.success('删除成功！');
        getList(pagination.current);

        setDeleteLoading([]);
      },
    });
  };

  // 编辑弹框 data - 详情
  const [updateSubmitLoading, setUpdateSubmitLoading] = useState<boolean>(false);
  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<Partial<TableListItem>>({});
  const [detailUpdateLoading, setDetailUpdateLoading] = useState<string[]>([]);
  const detailUpdateData = async (code: string) => {
    setDetailUpdateLoading([code]);

    // const response: ResponseData<TableListItem> = await detailData(id.toString());
    // const { data } = response;
    const { mobile, name } = list.filter((item: TableListItem) => item.code === code)[0];
    setUpdateData({
      code,
      mobile,
      name,
    });
    setUpdateFormVisible(true);

    setDetailUpdateLoading([]);
  };

  const updataFormCancel = async () => {
    setUpdateData({});
    setUpdateFormVisible(false);
  };

  const updateSubmit = async (values: TableListItem) => {
    setUpdateSubmitLoading(true);

    const { code, ...params } = values;
    await updateDataService(code || '', { ...params });
    updataFormCancel();
    message.success('编辑成功！');
    getList(pagination.current);

    setUpdateSubmitLoading(false);
  };

  // 新增
  const [createSubmitLoading, setCreateSubmitLoading] = useState<boolean>(false);
  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  // const [deviceSubmitLoading, setDeviceSubmitLoading] = useState<boolean>(false);
  // const [deviceFormVisible, setDeviceFormVisible] = useState<boolean>(false);

  const createSubmit = async (values: Omit<TableListItem, 'id'>, form: FormInstance) => {
    setCreateSubmitLoading(true);
    const { code, message: serviceMsg } = await updPassword(values);
    if (code === '200') {
      form.resetFields();
      setCreateFormVisible(false);
      message.success('编辑成功！');
      getList(1);
    } else {
      message.error(`新增失败！${serviceMsg}`);
    }
    setCreateSubmitLoading(false);
  };

  const columns: ColumnsType<TableListItem> = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
    },
    {
      title: '客服编号',
      dataIndex: 'code',
    },
    {
      title: '客服名称',
      dataIndex: 'name',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type='link'
            loading={detailUpdateLoading.includes(record.code || '')}
            onClick={() => detailUpdateData(record.code || '')}
          >
            编辑
          </Button>
          <Divider type='vertical' />
          {/* <Button
            type='link'
            loading={deleteLoading.includes(record.id)}
            onClick={() => detailUpdatePassword(record.id)}
          >
            修改密码
          </Button> */}
        </>
      ),
    },
  ];

  return (
    <div className='layout-main-conent'>
      <Card
        bordered={false}
        title={
          <>
            {/* <Button type='primary' onClick={() => setCreateFormVisible(true)}>
              新增
            </Button> */}
            {/* <Button className='otherBtn' type='primary' onClick={() => setDeviceFormVisible(true)}>
              生成设备二维码
            </Button> */}
          </>
        }
        extra={
          <div>
            {/* <Radio.Group defaultValue='all'>
              <Radio.Button value='all'>全部</Radio.Button>
              <Radio.Button value='header'>头部</Radio.Button>
              <Radio.Button value='footer'>底部</Radio.Button>
            </Radio.Group> */}
            {/* <Input.Search placeholder='请输入' style={{ width: '270px', marginLeft: '16px' }} onSearch={() => ({})} /> */}
          </div>
        }
      >
        <Table
          rowKey='id'
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page: number) => {
              getList(page);
            },
          }}
        />
      </Card>

      <CreateForm
        onCancel={() => setCreateFormVisible(false)}
        visible={createFormVisible}
        onSubmit={createSubmit}
        onSubmitLoading={createSubmitLoading}
        values={updateData}
      />

      {/* <DeviceForm
        onCancel={() => setDeviceFormVisible(false)}
        visible={deviceFormVisible}
        onSubmit={createDeviceSubmit}
        onSubmitLoading={deviceSubmitLoading}
      /> */}

      {updateFormVisible && Object.keys(updateData).length > 0 ? (
        <UpdateForm
          values={updateData}
          onCancel={() => updataFormCancel()}
          visible={updateFormVisible}
          onSubmit={updateSubmit}
          onSubmitLoading={updateSubmitLoading}
        />
      ) : null}
    </div>
  );
}

export default App;
