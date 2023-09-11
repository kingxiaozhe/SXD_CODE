import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message, InputNumber } from 'antd';

// import TypeSelect from './TypeSelect';

import { TableListItem } from '../data';

interface DeviceFormProps {
  visible: boolean;
  values?: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: Omit<TableListItem, 'id'>, form: FormInstance) => void;
  onCancel: () => void;
}

const DeviceForm: React.FC<DeviceFormProps> = (props) => {
  const { visible, values, onSubmit, onSubmitLoading, onCancel } = props;

  const formVals: Omit<TableListItem, 'id'> = {
    name: values?.name || '',
    desc: values?.desc || '',
    href: values?.href || '',
    type: values?.type || '',
    duration: values?.duration || '30',
    amount: values?.amount || '30',
  };

  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      const fieldsValue = await form.validateFields();
      onSubmit({ ...formVals, ...fieldsValue }, form);
    } catch (error) {
      message.warning('验证错误');
    }
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title='新增'
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key='back' onClick={() => onCancel()}>
          取消
        </Button>,
        <Button key='submit' type='primary' htmlType='submit' loading={onSubmitLoading} onClick={() => onFinish()}>
          提交
        </Button>,
      ]}
    >
      <Form
        form={form}
        name='deviceform'
        labelCol={{ span: 6 }}
        initialValues={{
          name: formVals.name,
          duration: formVals.duration,
          amount: formVals.amount,
          // type: formVals.type,
        }}
      >
        {/* <Form.Item
          label='位置'
          name='type'
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
        >
          <TypeSelect placeholder='请选择' />
        </Form.Item> */}
        <Form.Item
          label='设备号'
          name='name'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('请输入名称');
                } else if (value.length > 15) {
                  throw new Error('长度不能大于15个字');
                }
              },
            },
          ]}
        >
          <Input placeholder='请输入名称' />
        </Form.Item>
        {/* <Form.Item
          label='套餐时长(分钟)'
          name='duration'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (Number.isNaN(value)) {
                  throw new Error('请输入正确的套餐时长(分钟)');
                }
              },
            },
          ]}
        >
          <InputNumber min={1} max={999} defaultValue={30} placeholder='请输入套餐时长(分钟)' />
        </Form.Item> */}

        {/* <Form.Item label='套餐金额' name='amount'>
          <InputNumber min={1} max={9999} defaultValue={30} placeholder='请输入套餐金额' />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default DeviceForm;
