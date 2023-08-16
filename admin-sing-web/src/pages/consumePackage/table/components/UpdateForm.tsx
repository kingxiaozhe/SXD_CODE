import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message } from 'antd';

import TypeSelect from './TypeSelect';

import { TableListItem } from '../data';

interface UpdateFormPorps {
  visible: boolean;
  values: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: TableListItem, form: FormInstance) => void;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormPorps> = (props) => {
  const { visible, values, onSubmit, onSubmitLoading, onCancel } = props;

  const formVals: TableListItem = {
    id: values.id || 0,
    name: values.name || '',
    duration: values.duration || '',
    amount: values.amount || '',
    // type: values.type || '',
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
      title='编辑'
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
        labelCol={{ span: 4 }}
        initialValues={{
          name: formVals.name,
          duration: formVals.duration,
          amount: formVals.amount,
          // type: formVals.type,
        }}
      >
        <Form.Item
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
        </Form.Item>
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
          <Input placeholder='请输入名称' />
        </Form.Item>
        <Form.Item
          label='时长(分钟)'
          name='duration'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('请输入套餐时长(分钟)');
                } else if (
                  // eslint-disable-next-line no-useless-escape
                  // !/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)
                  Number.isNaN(value)
                ) {
                  throw new Error('请输入正确的套餐时长(分钟)');
                }
              },
            },
          ]}
        >
          <Input placeholder='请输入套餐时长(分钟)' />
        </Form.Item>

        <Form.Item
          label='金额'
          name='amount'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value || Number.isNaN(value)) {
                  throw new Error('请输入套餐金额');
                }
              },
            },
          ]}
        >
          <Input placeholder='请输入套餐金额' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
