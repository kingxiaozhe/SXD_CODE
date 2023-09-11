import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message, InputNumber } from 'antd';

// import TypeSelect from './TypeSelect';

import { TableListItem } from '../data';

interface CreateFormProps {
  visible: boolean;
  values?: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: Omit<TableListItem, 'id'>, form: FormInstance) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { visible, values, onSubmit, onSubmitLoading, onCancel } = props;

  const formVals: Omit<TableListItem, 'duration'> = {
    name: values?.name || '',
    desc: values?.desc || '',
    href: values?.href || '',
    type: values?.type || '',
    // duration: values?.duration || '30',
    amount: values?.amount || '30',
    id: values?.id || 0,
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
        name='createform'
        labelCol={{ span: 6 }}
        initialValues={{
          name: formVals.name,
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
          label='名称'
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
          <Input placeholder='请输入名称' disabled />
        </Form.Item>
        <Form.Item
          name='oldPassword'
          label='原密码'
          rules={[
            {
              required: true,
              message: '请输入原密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='newPassword'
          label='新密码'
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
