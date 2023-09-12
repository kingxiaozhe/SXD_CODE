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
  const [detailUpdateLoading, setDetailUpdateLoading] = useState<number[]>([]);
  const detailUpdateData = async (id: number) => {
    setDetailUpdateLoading([id]);

    // const response: ResponseData<TableListItem> = await detailData(id.toString());
    // const { data } = response;
    const { name, mobile, roleName } = list.filter((item: TableListItem) => item.id === id)[0];
    setUpdateData({
      id,
      name,
      mobile,
      roleName,
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

    const { id, ...params } = values;
    await updateDataService(id, { ...params });
    updataFormCancel();
    message.success('编辑成功！');
    getList(pagination.current);

    setUpdateSubmitLoading(false);
  };

  // 新增
  const [createSubmitLoading, setCreateSubmitLoading] = useState<boolean>(false);
  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  const [deviceSubmitLoading, setDeviceSubmitLoading] = useState<boolean>(false);
  const [deviceFormVisible, setDeviceFormVisible] = useState<boolean>(false);
  const detailUpdatePassword = async (id: number) => {
    setDetailUpdateLoading([id]);

    // const response: ResponseData<TableListItem> = await detailData(id.toString());
    // const { data } = response;
    const { id: filterId, name } = list.filter((item: TableListItem) => item.id === id)[0];
    debugger;
    setUpdateData({
      id: filterId,
      name,
    });
    setCreateFormVisible(true);

    setDetailUpdateLoading([]);
  };

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
  // 根据设备号，输出设备二维码
  const createDeviceSubmit = async (values: Omit<TableListItem, 'id'>) => {
    setDeviceSubmitLoading(true);
    // 当前小程序配置信息
    const miniConfig = {
      appid: 'wx61577d6c2f49df3c',
      secret: '4a2768ac886f2980a5611ec92e413a92',
    };
    // 根据小程序配置信息获取小程序Token
    const miniToken = await getTokenData(miniConfig);
    generateImage({
      token: miniToken.access_token,
      scene: `device_id=${values.name}`,
      page: 'pages/home/home',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `设备号[${values.name}]二维码.png`); // 你的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('There was an error fetching the binary data: ', error);
      });
    // form.resetFields();
    setDeviceFormVisible(false);
    message.success('新增成功！');

    setDeviceSubmitLoading(false);
  };

  const columns: ColumnsType<TableListItem> = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
    },
    {
      title: '用户账号',
      dataIndex: 'name',
      render: (_, record) => (
        <a href={record.href} target='_blank' rel='noreferrer'>
          {record.name}
        </a>
      ),
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '用户角色',
      dataIndex: 'roleName',
    },
    {
      title: '备注',
      dataIndex: 'mark',
    },
    // {
    //   title: '套餐金额',
    //   dataIndex: 'amount',
    //   render: (_, record) => (record.type === 'header' ? <Tag color='green'>头部</Tag> : <Tag color='cyan'>底部</Tag>),
    // },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type='link'
            loading={detailUpdateLoading.includes(record.id)}
            onClick={() => detailUpdateData(record.id)}
          >
            编辑
          </Button>
          <Divider type='vertical' />
          <Button
            type='link'
            loading={deleteLoading.includes(record.id)}
            onClick={() => detailUpdatePassword(record.id)}
          >
            修改密码
          </Button>
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

      <DeviceForm
        onCancel={() => setDeviceFormVisible(false)}
        visible={deviceFormVisible}
        onSubmit={createDeviceSubmit}
        onSubmitLoading={deviceSubmitLoading}
      />

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
