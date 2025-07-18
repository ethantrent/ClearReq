import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './FileUpload';

describe('FileUpload', () => {
  it('renders upload button and input', () => {
    render(
      <FileUpload
        selectedFile={null}
        error={''}
        loading={false}
        fileInputRef={{ current: null }}
        onFileChange={() => {}}
        onLabelClick={() => {}}
        onDrop={() => {}}
        onDragOver={() => {}}
        onAnalyze={() => {}}
      />
    );
    expect(screen.getByText(/Upload Your Document/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze Document/i })).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('displays error message when error prop is set', () => {
    render(
      <FileUpload
        selectedFile={null}
        error={'Test error'}
        loading={false}
        fileInputRef={{ current: null }}
        onFileChange={() => {}}
        onLabelClick={() => {}}
        onDrop={() => {}}
        onDragOver={() => {}}
        onAnalyze={() => {}}
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
}); 