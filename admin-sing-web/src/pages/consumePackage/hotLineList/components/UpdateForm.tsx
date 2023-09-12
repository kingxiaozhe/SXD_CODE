import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message, InputNumber } from 'antd';

// import TypeSelect from './TypeSelect';

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
    // id: values.id || 0,
    name: values.name || '',
    mobile: values.mobile || '',
    code: values.code || '',
    mark: values.mark || '',
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
          mobile: formVals.mobile,
          code: formVals.code,
          mark: formVals.mark,
        }}
      >
        <Form.Item label='客服编号' name='code'>
          <Input placeholder='请输入名称' disabled />
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
          <Input placeholder='请输入名称' disabled />
        </Form.Item>
        <Form.Item
          label='手机号码'
          name='mobile'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('请输入手机号码');
                } else if (
                  // eslint-disable-next-line no-useless-escape
                  // !/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)
                  Number.isNaN(value)
                ) {
                  throw new Error('请输入正确的手机号码');
                }
              },
            },
          ]}
        >
          <Input placeholder='请输入手机号码' />
        </Form.Item>

        <Form.Item
          label='备注'
          name='mark'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('请输入名称');
                } else if (value.length > 50) {
                  throw new Error('长度不能大于50个字');
                }
              },
            },
          ]}
        >
          <Input placeholder='请输入备注' />
        </Form.Item>

        {/* <Form.Item
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
          <InputNumber min={1} max={9999} defaultValue={30} placeholder='请输入套餐金额' />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
