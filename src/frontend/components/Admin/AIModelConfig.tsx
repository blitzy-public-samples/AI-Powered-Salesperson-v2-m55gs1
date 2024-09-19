import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAIModels, updateAIModel, trainAIModel } from '@/store/aiModelSlice';
import { AIModel, AIModelConfig } from '@/types';
import { Form, Input, Select, Slider } from '@/components/UI/Form';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { Table } from '@/components/UI/Table';
import { Tabs, TabPane } from '@/components/UI/Tabs';
import { validateModelConfig } from '@/utils/validators';
import styles from '@/styles/AIModelConfig.module.css';

const AIModelConfigComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [modelConfig, setModelConfig] = useState<AIModelConfig | null>(null);

  // Fetch AI models from Redux store
  const aiModels = useSelector((state: any) => state.aiModel.models);

  // Fetch AI models on component mount
  useEffect(() => {
    dispatch(fetchAIModels());
  }, [dispatch]);

  const renderModelList = (models: AIModel[]): JSX.Element => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Type', dataIndex: 'type', key: 'type' },
      { title: 'Version', dataIndex: 'version', key: 'version' },
      {
        title: 'Actions',
        key: 'actions',
        render: (text: string, record: AIModel) => (
          <>
            <Button onClick={() => setSelectedModel(record)}>Configure</Button>
            <Button onClick={() => handleTrainModel(record.id)}>Train</Button>
          </>
        ),
      },
    ];

    return <Table columns={columns} dataSource={models} />;
  };

  const renderModelConfig = (model: AIModel): JSX.Element => {
    return (
      <Form onSubmit={(values) => handleUpdateModel(values as AIModelConfig)}>
        <Input name="name" label="Model Name" defaultValue={model.name} />
        <Input name="version" label="Version" defaultValue={model.version} />
        
        {model.type === 'NLP' && (
          <>
            <Select name="language" label="Language" options={['English', 'Spanish', 'French']} />
            <Slider name="confidenceThreshold" label="Confidence Threshold" min={0} max={1} step={0.1} />
          </>
        )}

        {model.type === 'RAG' && (
          <>
            <Input name="knowledgeBase" label="Knowledge Base URL" />
            <Slider name="retrievalTopK" label="Retrieval Top K" min={1} max={20} step={1} />
          </>
        )}

        {model.type === 'QuoteGeneration' && (
          <>
            <Select name="pricingModel" label="Pricing Model" options={['Fixed', 'Dynamic', 'Tiered']} />
            <Slider name="creativityFactor" label="Creativity Factor" min={0} max={1} step={0.1} />
          </>
        )}

        <Button type="submit">Update Configuration</Button>
      </Form>
    );
  };

  const handleUpdateModel = async (config: AIModelConfig) => {
    try {
      const isValid = validateModelConfig(config);
      if (!isValid) {
        throw new Error('Invalid model configuration');
      }
      await dispatch(updateAIModel(config));
      Modal.success({ content: 'Model configuration updated successfully' });
    } catch (error) {
      Modal.error({ content: `Failed to update model: ${error.message}` });
    }
  };

  const handleTrainModel = async (modelId: string) => {
    try {
      const confirmed = await Modal.confirm({
        title: 'Train Model',
        content: 'Are you sure you want to start training this model?',
      });
      if (confirmed) {
        await dispatch(trainAIModel(modelId));
        Modal.success({ content: 'Model training initiated successfully' });
      }
    } catch (error) {
      Modal.error({ content: `Failed to initiate model training: ${error.message}` });
    }
  };

  return (
    <div className={styles.aiModelConfig}>
      <h1>AI Model Configuration</h1>
      <Tabs>
        <TabPane tab="NLP Models" key="nlp">
          {renderModelList(aiModels.filter((model: AIModel) => model.type === 'NLP'))}
        </TabPane>
        <TabPane tab="RAG Models" key="rag">
          {renderModelList(aiModels.filter((model: AIModel) => model.type === 'RAG'))}
        </TabPane>
        <TabPane tab="Quote Generation Models" key="quote">
          {renderModelList(aiModels.filter((model: AIModel) => model.type === 'QuoteGeneration'))}
        </TabPane>
      </Tabs>
      {selectedModel && (
        <div className={styles.modelConfigContainer}>
          <h2>Configure {selectedModel.name}</h2>
          {renderModelConfig(selectedModel)}
        </div>
      )}
    </div>
  );
};

export default AIModelConfigComponent;

// Human tasks:
// TODO: Implement advanced model parameter tuning interface
// TODO: Add visualization for model performance metrics
// TODO: Implement A/B testing functionality for model comparisons